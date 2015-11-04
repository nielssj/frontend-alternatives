var React = require('react');
var ReactPropTypes = React.PropTypes;
var AppActions = require("../actions/AppActions");
var MomentStore = require("../stores/MomentStore");

var Header = React.createClass({

    propTypes: {

    },

    getInitialState: function() {
        return {
            validationError: null
        };
    },

    componentDidMount: function() {
        MomentStore.addCreationInvalidListener(this._onInvalidPost);
    },

    render: function() {

        var validationErrorElement;
        if(this.state.validationError) {
            validationErrorElement = (
                <span className="validation-error"> {this.state.validationError[0].message}</span>
            );
        }

        return (
            <header id="header" className="jumbotron">
                <h1>Share a moment</h1>
                <p className="lead">What just happened? You better share it!</p>
                <textarea ref="momentTextInput" className="form-control" rows="3"></textarea>
                <br />
                <p><a onClick={this._onPost} className="btn btn-lg btn-primary" href="#" role="button">Share moment</a></p>
                {validationErrorElement}
            </header>
        );
    },

    _onPost: function() {
        // Reset validation error state
        this.setState({
            validationError: null
        });

        // Emit creation action
        AppActions.createMoment({
            authorId: "9ab95fb7-f725-403a-a17f-8f0086faf4e8", // TODO: Get this from somewhere
            authorName: "Niels Søholm",
            text: this.refs.momentTextInput.value
        });
    },

    _onInvalidPost: function(validationError) {
        this.setState({
            validationError: validationError
        });
    }
});

module.exports = Header;