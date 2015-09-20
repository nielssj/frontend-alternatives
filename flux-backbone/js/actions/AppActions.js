var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

    fetchMoments: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_FETCH_MOMENTS
        });
    },

    createMoment: function(moment) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_CREATE_MOMENT,
            moment: moment
        });
    },

    createComment: function(comment) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ACTION_CREATE_COMMENT,
            comment: comment
        });
    }

};

module.exports = AppActions;