var React = require('react');
var ReactPropTypes = React.PropTypes;
var AppActions = require("../actions/AppActions");
var MomentStore = require("../stores/MomentStore");

var ChatMessage = React.createClass({

    propTypes: {
        message: ReactPropTypes.object.isRequired
    },

    getInitialState: function() {
        return {};
    },

    render: function() {
        var messageClass = "chat-message";

        if(this.props.message.isSelf) {
            messageClass += " chat-message-me";
        }

        return (
            <div className={messageClass}>
                <div className="pull-left chat-message-thumb">
                    <div>IMG</div>
                </div>
                <div className="chat-message-body">
                    <strong>{this.props.message.authorName}</strong>
                    <p>{this.props.message.text}</p>
                </div>
            </div>
        );
    }
});

module.exports = ChatMessage;