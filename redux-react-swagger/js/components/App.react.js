var Header = require('./Header.react');
var React = require('react');
var MomentStore = require("../stores/MomentStore");
var AppActions = require("../actions/AppActions");
var Stream = require("./Stream.react");
var Router = require("../Router");
var NavConstants = require("../constants/NavigationConstants");
var NavigationBar = require("./NavigationBar.react");
var Chat = require("./Chat.react");

var App = React.createClass({

    getInitialState: function() {
        return {
            moments: MomentStore.getAll()
        };
    },

    componentWillMount: function() {
        this.callback = (function() {
            this.forceUpdate();
        }).bind(this);
        Router.on("route", this.callback);
    },

    componentDidMount: function() {
        MomentStore.initialize(function() {
            MomentStore.addChangeListener(this._onChange);
            AppActions.fetchMoments();
        }.bind(this));
    },

    componentWillUnmount: function() {
        MomentStore.removeChangeListener(this._onChange);
        Router.off("route", this.callback);
    },

    render: function() {
        var currentPage = null;
        switch(Router.current.page) {
            case NavConstants.PAGE_STREAM:
                currentPage = (
                    <div>
                        <Header />
                        <Stream moments={this.state.moments} />
                    </div>);
                break;
            case NavConstants.PAGE_CHAT:
                currentPage = <Chat />
                break;
            case NavConstants.PAGE_PROFILE:
                currentPage = <p>Here should be the profile of the current user</p>; // TODO: Implement this
                break;
        }

        return (
            <div>
                <NavigationBar />
                {currentPage}
            </div>
        );
    },

    _onChange: function() {
        this.setState({
            moments: MomentStore.getAll()
        });
    }

});

module.exports = App;