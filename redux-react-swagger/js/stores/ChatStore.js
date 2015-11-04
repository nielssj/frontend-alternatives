var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var Backbone = require("backbone");
var Utilities = require('./Utilities');
Backbone.Validation = require('backbone-validation');

var endpointHost = "http://127.0.0.1:5984";

var Message = Backbone.Model.extend({
    validation: {
        text: {
            required: true,
            minLength: 1,
            maxLength: 400
        }
    }
});

var MessageCollection = Backbone.Collection.extend({
    model: Message,
    url: endpointHost + "/messages",
    parse: Utilities.parseCouch
});

var messages = new MessageCollection();

var ChatStore = assign({}, EventEmitter.prototype, {
    /**
     * Post new message
     */
    post: function(message) {
        messages.create(message);
    },

    /**
        Retrieve recent message history
     */
    getRecent: function() {
        return messages.toArray();
    },

    /**
     * Listen for new messages
     * @param callback to be invoked upon new messages
     */
    addMessageListener: function(callback) {
        // TODO: Do something
    },

    /**
     * Stop listening for new messages
     * @param callback to nolonger be invoked upon new messages
     */
    removeMessageListener: function(callback) {
        // TODO: Do something
    },

    /**
     * Listen for errors upon post regarding message validity
     * @param callback
     */
    addPostInvalidListener: function(callback) {
        this.on(AppConstants.EVENT_CREATION_INVALID, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        // Fetch recent messages
        case AppConstants.ACTION_FETCH_MOMENTS:
            messages.fetch({url: "http://127.0.0.1:5984/moments/_design/example/_view/author"});
            break;
        default:
            // no op
    }
});

module.exports = ChatStore;