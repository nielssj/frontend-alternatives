var Backbone = require("backbone");
var NavConstants = require("./constants/NavigationConstants");

var Router = Backbone.Router.extend({
    routes : {
        "stream": "stream",
        "friends": "friends",
        ".*": "stream"
    },
    stream : function() {
        this.current = { page: NavConstants.PAGE_STREAM };
    },
    friends : function() {
        this.current = { page: NavConstants.PAGE_FRIENDS };
    }
});

module.exports = new Router();
Backbone.history.start();