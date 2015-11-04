var keyMirror = require('keymirror');

module.exports = keyMirror({
    // Actions
    ACTION_FETCH_MOMENTS: null,
    ACTION_FETCH_COMMENTS_FOR: null,
    ACTION_CREATE_MOMENT: null,
    ACTION_UPDATE_MOMENT: null,
    ACTION_DELETE_MOMENT: null,
    ACTION_CREATE_COMMENT: null,
    ACTION_DELETE_COMMENT: null,
    // Events
    EVENT_MOMENTS_CHANGED: null,
    EVENT_CREATION_INVALID: null
});