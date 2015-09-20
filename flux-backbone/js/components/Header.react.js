var React = require('react');
var ReactPropTypes = React.PropTypes;
var AppActions = require("../actions/AppActions");

var Header = React.createClass({

    propTypes: {

    },

    render: function() {

        return (
            <header id="header">
                <p>
                    <input type="text" ref="momentTextInput" />
                    <input type="button" value="Post" onClick={this._onPost} />
                </p>
            </header>
        );
    },

    _onPost: function() {
        AppActions.createMoment({
            authorId: "9ab95fb7-f725-403a-a17f-8f0086faf4e8", // TODO: Get this from somewhere
            authorName: "Niels Søholm",
            text: this.refs.momentTextInput.getDOMNode().value
        });
    }
});

module.exports = Header;