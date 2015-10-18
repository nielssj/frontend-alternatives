var Backbone = require("backbone");
var NavConstants = require("./constants/NavigationConstants");

var Router = Backbone.Router.extend({
    routes : {
        "stream": "stream",
        "chat": "chat",
        "profile": "profile",
        ".*": "stream"
    },
    stream : function() {
        this.current = { page: NavConstants.PAGE_STREAM };
    },
    chat : function() {
        this.current = { page: NavConstants.PAGE_CHAT };
    },
    profile : function() {
        this.current = { page: NavConstants.PAGE_PROFILE };
    }
});

module.exports = new Router();
Backbone.history.start();