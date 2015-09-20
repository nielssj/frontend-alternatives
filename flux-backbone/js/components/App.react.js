var Header = require('./Header.react');
var React = require('react');
var MomentStore = require("../stores/MomentStore");
var AppActions = require("../actions/AppActions");
var Stream = require("./Stream.react");

function getTodoState() {
    return {
        moments: MomentStore.getAll()
    };
}

var App = React.createClass({

    getInitialState: function() {
        return getTodoState();
    },

    componentDidMount: function() {
        MomentStore.addChangeListener(this._onChange);
        AppActions.fetchMoments();
    },

    componentWillUnmount: function() {
        MomentStore.removeChangeListener(this._onChange);
    },

    render: function() {
        return (
            <div>
                <Header />
                <Stream moments={this.state.moments} />
            </div>
        );
    },

    _onChange: function() {
        this.setState(getTodoState());
    }

});

module.exports = App;