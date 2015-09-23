var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

    fetchMoments: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_FETCH_MOMENTS
        });
    },

    fetchCommentsFor: function(momentId) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_FETCH_COMMENTS_FOR,
            momentId: momentId
        });
    },

    createMoment: function(moment) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_CREATE_MOMENT,
            moment: moment
        });
    },

    updateMoment: function(momentId, changes) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_UPDATE_MOMENT,
            momentId: momentId,
            changes: changes
        });
    },

    deleteMoment: function(moment) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_DELETE_MOMENT,
            moment: moment
        });
    },

    createComment: function(comment) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_CREATE_COMMENT,
            comment: comment
        });
    },

    deleteComment: function(comment) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_DELETE_COMMENT,
            comment: comment
        });
    }

};

module.exports = AppActions;