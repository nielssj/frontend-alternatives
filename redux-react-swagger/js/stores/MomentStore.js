var client = require('swagger-client');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
var _ = require('underscore');
var Utilities = require('./Utilities');

import {
    ACTION_FETCH_MOMENTS, ACTION_FETCH_COMMENTS_FOR, ACTION_CREATE_MOMENT, ACTION_DELETE_MOMENT, ACTION_UPDATE_MOMENT, ACTION_CREATE_COMMENT, ACTION_DELETE_COMMENT,
    EVENT_MOMENTS_CHANGED, EVENT_CREATION_INVALID
} from '../constants/AppConstants.js';

var endpointHost = "http://127.0.0.1:5984";
var api;
var moments = [];

var MomentStore = assign({}, EventEmitter.prototype, {
    initialize: function(callback) {
        var swagger = new client({
            url: "http://localhost:10010/swagger",
            success: function() {
                api = this.apis.default;
                callback();
            }
        });
    },

    getAll: function() {
        return moments;
    },

    addChangeListener: function(callback) {
        this.on(EVENT_MOMENTS_CHANGED, callback);
    },

    removeChangeListener: function(callback) {
        this.off(EVENT_MOMENTS_CHANGED, callback);
    },

    addCreationInvalidListener: function(callback) {
        this.on(EVENT_CREATION_INVALID, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        // Fetch moments
        case ACTION_FETCH_MOMENTS:
            api.getMoments({}, function(res) {
                moments = res.obj;
                MomentStore.emit(EVENT_MOMENTS_CHANGED);
            });
            break;
        // Fetch comments for
        case ACTION_FETCH_COMMENTS_FOR:
            var id = action.momentId;
            setTimeout(function() {
                api.getComments({id: id},
                    function(res) {
                        var moment = _.find(moments, m => m["_id"] == id);
                        moment.comments = res.obj;
                        MomentStore.emit(EVENT_MOMENTS_CHANGED);
                    }
                );
            }, 1000); // NOTE: Added a fake timeout to demo loading animation
            break;
        // Create moment
        case ACTION_CREATE_MOMENT:
            api.postMoment({moment: action.moment},
                function(res) {
                    moments.push(res.obj);
                    MomentStore.emit(EVENT_MOMENTS_CHANGED);
                },
                function(err) {
                    if(err.status == 400) {
                        var errors = JSON.parse(err.data).results.errors;
                        MomentStore.emit(EVENT_CREATION_INVALID, errors);
                    }
                }
            );
            break;
        // Delete moment
        case ACTION_DELETE_MOMENT:
            api.deleteMoment({id:action.moment["_id"]},
                function(res) {
                    moments = _.reject(moments, m => m["_id"] == res["_id"]);
                    MomentStore.emit(EVENT_MOMENTS_CHANGED);
                }
            );
            break;
        // Update moment
        case ACTION_UPDATE_MOMENT:
            api.putMoment({ id:action.momentId, changes: action.changes},
                function(res) {
                    var mid = _.findIndex(moments, m => m["_id"] == res["_id"]);
                    moments[mid] = res;
                    MomentStore.emit(EVENT_MOMENTS_CHANGED);
                }
            );
            break;
        // Create comment
        case ACTION_CREATE_COMMENT:
            var comment = action.comment;
            comment.authorName = "Niels Søholm"; // TODO: Get user details from somewhere appropriate
            comment.authorId = "9ab95fb7f725403aa17f8f0086faf4e8";

            api.postComment(
                {
                    id: comment.parentMoment,
                    comment: comment
                },
                function(res) {
                    var moment = _.find(moments, m => m["_id"] == comment.parentMoment);
                    if(moment.comments) {
                        moment.comments.push(res.obj)
                    } else {
                        moments.comments = [res.obj];
                    }
                    MomentStore.emit(EVENT_MOMENTS_CHANGED);
                },
                function(err) {
                    var errors = JSON.parse(err.data).results.errors;
                    MomentStore.emit(EVENT_CREATION_INVALID, errors);
                }
            );
            break;
        // Delete comment
        case ACTION_DELETE_COMMENT:
            var comment = action.comment;
            api.deleteComment(
                {
                    id: comment.parentMoment,
                    cid: comment["_id"]
                },
                function(res) {
                    var moment = _.find(moments, m => m["_id"] == comment.parentMoment);
                    moment.comments = _.reject(moment.comments, m => m["_id"] == res.obj["_id"]);
                    MomentStore.emit(EVENT_MOMENTS_CHANGED);
                },
                function(err) {
                    console.error(err);
                }
            );
            break;
        default:
            // no op
    }
});

module.exports = MomentStore;