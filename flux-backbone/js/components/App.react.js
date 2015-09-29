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
                <div className="header clearfix">
                    <nav>
                        <ul className="nav nav-pills pull-right">
                            <li role="presentation" className="active"><a href="#">Stream</a></li>
                            <li role="presentation"><a href="#">Friends</a></li>
                            <li role="presentation"><a href="#">Profile</a></li>
                        </ul>
                    </nav>
                    <h3 className="text-muted">
                        <span className="glyphicon glyphicon-education" aria-hidden="true"></span>
                        Alternatives</h3>
                </div>
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