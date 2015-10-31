var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var Backbone = require("backbone");
var _ = require('underscore');
var Utilities = require('./Utilities');
Backbone.Validation = require('backbone-validation');


var endpointHost = "http://127.0.0.1:5984";

// Enable model validation
_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

// Comment collection
var Comment = Backbone.Model.extend({
    validation: {
        text: {
            required: true,
            minLength: 1,
            maxLength: 400
        }
    }
});
var CommentCollection = Backbone.Collection.extend({
    model: Comment,
    url: endpointHost + "/comments",
    parse: Utilities.parseCouch
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
    parse: Utilities.parseCouch
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
        moments.on("destroy", callback);
    },

    removeChangeListener: function(callback) {
        moments.off("sync", callback);
        moments.off("destroy", callback);
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
            setTimeout(function() {
                moment.comments.fetch({
                    url: "http://127.0.0.1:5984/comments/_design/example/_view/by_parent",
                    data: { key: "\"" + action.momentId + "\"" }
                });
            }, 1000); // NOTE: Added a fake timeout to demo loading animation
            break;
        // Create moment
        case AppConstants.ACTION_CREATE_MOMENT:
            var moment = moments.create(action.moment, {wait: true});
            if(moment.validationError) {
                MomentStore.emit(AppConstants.EVENT_CREATION_INVALID, moment.validationError);
            }
            break;
        // Delete moment
        case AppConstants.ACTION_DELETE_MOMENT:
            var headers = {
                "If-Match": action.moment.get("rev")
            };
            action.moment.destroy({headers: headers});
            break;
        // Update moment
        case AppConstants.ACTION_UPDATE_MOMENT:
            var moment = moments.get(action.momentId);
            moment.set(action.changes);
            moment.save({}, { headers:{ "If-Match":moment.get("rev") } });
            break;
        // Create comment
        case AppConstants.ACTION_CREATE_COMMENT:
            action.comment.authorName = "Niels Søholm"; // TODO: Get user details from somewhere appropriate
            action.comment.authorId = "9ab95fb7f725403aa17f8f0086faf4e8";
            var moment = moments.get(action.comment.parentMoment);
            var comment = moment.comments.create(action.comment);
            if(comment.validationError) {
                action.invalid(comment.validationError);
            }
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