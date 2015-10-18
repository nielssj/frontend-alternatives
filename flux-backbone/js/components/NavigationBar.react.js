var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require("../Router");

var NavigationBar = React.createClass({

    getInitialState: function() {
        return {
            pages: [
                { title: "Stream", path: "stream" },
                { title: "Chat", path: "chat" },
                { title: "Profile", path: "profile" }
            ],
            active: "stream"
        };
    },

    render: function() {

        // Construct list of page links
        var pageLinks = [];
        this.state.pages.forEach(function(page) {
            var className = (this.state.active == page.path) ? "active" : "";
            var element = (
                <li role="presentation" className={className} key={page.title}>
                    <a onClick={this.onNavigateClick.bind(this, page.path)} className="nav-link">
                        {page.title}
                    </a>
                </li>
            );
            pageLinks.push(element);
        }.bind(this));

        // Render
        return (
            <div className="header clearfix">
                <nav>
                    <ul className="nav nav-pills pull-right">
                        {pageLinks}
                    </ul>
                </nav>
                <h3 className="text-muted" onClick={this.onNavigateClick.bind(this, "stream")}>
                    <span className="glyphicon glyphicon-education" aria-hidden="true"></span>
                    Alternatives</h3>
            </div>
        );
    },

    // Navigate to given destination page
    onNavigateClick: function(destination) {
        Router.navigate(destination, { trigger:true });
        this.setState({ active:destination });
    }
});

module.exports = NavigationBar;