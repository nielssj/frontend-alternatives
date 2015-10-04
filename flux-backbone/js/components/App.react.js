var Header = require('./Header.react');
var React = require('react');
var MomentStore = require("../stores/MomentStore");
var AppActions = require("../actions/AppActions");
var Stream = require("./Stream.react");
var Router = require("../Router");
var NavConstants = require("../constants/NavigationConstants");
var NavigationBar = require("./NavigationBar.react");

function getTodoState() {
    return {
        moments: MomentStore.getAll()
    };
}

var App = React.createClass({

    getInitialState: function() {
        return getTodoState();
    },

    componentWillMount: function() {
        this.callback = (function() {
            this.forceUpdate();
        }).bind(this);
        Router.on("route", this.callback);
    },

    componentDidMount: function() {
        MomentStore.addChangeListener(this._onChange);
        AppActions.fetchMoments();
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
            case NavConstants.PAGE_FRIENDS:
                currentPage = <p>Here should be a list of friends</p>; // TODO: Implement this
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
        this.setState(getTodoState());
    }

});

module.exports = App;