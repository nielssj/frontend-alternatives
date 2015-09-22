var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var Backbone = require("backbone");
var _ = require('underscore');
Backbone.Validation = require('backbone-validation');


var endpointHost = "http://127.0.0.1:5984";

// Enable model validation
_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);


// Custom parse function (to support CouchDB)
parseCouch = function(data, options) {
    if( data.hasOwnProperty("rows") && _.isArray(data.rows) ) {
        return _.map(data.rows, function(doc) {
            doc.value.id = doc.id;
            doc.value.rev = doc.value["_rev"];
            return doc.value;
        });
    } else {
        return data;
    }
};

// Comment collection
var Comment = Backbone.Model.extend();
var CommentCollection = Backbone.Collection.extend({
    model: Comment,
    url: endpointHost + "/comments",
    parse: parseCouch
});

// Moment collection
var Moment = Backbone.Model.extend({
    initialize: function() {
        this.comments = new CommentCollection();
    },
    validation: {
        text: {
            required: true,
            minLength: 10
        }
    }
});
var MomentCollection = Backbone.Collection.extend({
    model: Moment,
    url: endpointHost + "/moments",
    parse: parseCouch
});


// Crate overall collections
var comments = new CommentCollection();
var moments = new MomentCollection();


var MomentStore = assign({}, EventEmitter.prototype, {
    /**
     * Creates new moment
     */
    create: function(moment) {
        moments.create(moment);
    },

    /**
        Retrieves all moments
     */
    getAll: function() {
        return moments.toArray();
    },

    addChangeListener: function(callback) {
        moments.on("sync", callback);
    },

    removeChangeListener: function(callback) {
        moments.off("sync", callback);
    },

    addCreationInvalidListener: function(callback) {
        this.on(AppConstants.EVENT_CREATION_INVALID, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        // Fetch moments
        case AppConstants.ACTION_FETCH_MOMENTS:
            moments.fetch({url: "http://127.0.0.1:5984/moments/_design/example/_view/author"});
            break;
        // Fetch comments for
        case AppConstants.ACTION_FETCH_COMMENTS_FOR:
            var moment = moments.get(action.momentId);
            moment.comments.fetch({
                url: "http://127.0.0.1:5984/comments/_design/example/_view/by_parent",
                data: { key: "\"" + action.momentId + "\"" }
            });
            break;
        // Create moment
        case AppConstants.ACTION_CREATE_MOMENT:
            var moment = moments.create(action.moment);
            if(moment.validationError) {
                MomentStore.emit(AppConstants.EVENT_CREATION_INVALID, moment.validationError);
            }
            break;
        // Update moment
        case AppConstants.ACTION_UPDATE_MOMENT:
            var moment = moments.get(action.momentId);
            moment.set(action.changes);
            moment.save({}, { headers:{ "If-Match":moment.get("rev") } });
            break;
        // Create comment
        case AppConstants.ACTION_CREATE_COMMENT:
            var moment = moments.get(action.comment.parentMoment);
            moment.comments.create(action.comment);
            break;
        // Delete comment
        case AppConstants.ACTION_DELETE_COMMENT:
            var headers = {
                "If-Match": action.comment.get("rev")
            };
            action.comment.destroy({headers:headers});
            break;
        default:
            // no op
    }
});

module.exports = MomentStore;