var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require("../Router");

var NavigationBar = React.createClass({

    getInitialState: function() {
        return {
            pages: [
                { title: "Stream", path: "stream", handler: this.onStreamClick},
                { title: "Friends", path: "friends", handler: this.onFriendsClick },
                { title: "Profile", path: "profile", handler: this.onProfileClick }
            ],
            active: "Stream"
        };
    },

    render: function() {

        // Construct list of page links
        var pageLinks = [];
        var active = this.state.active;
        this.state.pages.forEach(function(page) {
            var className = (active == page.title) ? "active" : "";
            var element = (
                <li role="presentation" className={className}>
                    <a onClick={page.handler} className="nav-link">{page.title}</a>
                </li>
            );
            pageLinks.push(element);
        });

        // Render
        return (
            <div className="header clearfix">
                <nav>
                    <ul className="nav nav-pills pull-right">
                        {pageLinks}
                    </ul>
                </nav>
                <h3 className="text-muted" onClick={this.onStreamClick}>
                    <span className="glyphicon glyphicon-education" aria-hidden="true"></span>
                    Alternatives</h3>
            </div>
        );
    },

    onStreamClick: function() {
        Router.navigate("stream", { trigger:true });
        this.setState( {active: "Stream"} );
    },

    onFriendsClick: function() {
        Router.navigate("friends", { trigger:true });
        this.setState( {active: "Friends"} );
    },

    onProfileClick: function() {
        Router.navigate("profile", { trigger:true });
        this.setState( {active: "Profile"} );
    }
});

module.exports = NavigationBar;