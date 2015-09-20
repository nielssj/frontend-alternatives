var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var Backbone = require("backbone");
var _ = require('underscore');


var endpointHost = "http://127.0.0.1:5984";

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
    getComments: function() {
        var comments = new CommentCollection();
        var momentId = this.get("_id");
        comments.fetch({
            url: "http://127.0.0.1:5984/comments/_design/example/_view/by_parent",
            data: {
                key: "\"" + momentId + "\""
            }
        });
        return comments;
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

    /**
     * Retrieves comments for a given parent
     */
    getCommentsFor: function(parent) {

    },

    addChangeListener: function(callback) {
        moments.on("sync", callback);
        //this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        moments.off("sync", callback);
        //this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case AppConstants.ACTION_FETCH_MOMENTS:
            moments.fetch({url: "http://127.0.0.1:5984/moments/_design/example/_view/author"});
            break;
        case AppConstants.ACTION_CREATE_MOMENT:
            moments.create(action.moment);
            break;
        case AppConstants.ACTION_CREATE_COMMENT:
            comments.create(action.comment);
            break;
        default:
            // no op
    }
});

module.exports = MomentStore;