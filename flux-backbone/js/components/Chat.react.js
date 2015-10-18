var React = require('react');
var ReactPropTypes = React.PropTypes;
var AppActions = require("../actions/AppActions");
var MomentStore = require("../stores/MomentStore");
var ChatMessage = require("./ChatMessage.react");

var Chat = React.createClass({

    propTypes: {
        
    },

    getInitialState: function() {
        return {};
    },

    render: function() {
        var messages = [
            {
                id: "6addcc4d-c601-4d68-a972-49634c5977d1",
                isSelf: false,
                authorName: "John Doe",
                text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
            },
            {
                id: "d25ed5ba-5c7d-460e-bdfd-b1a3e74b9c3a",
                isSelf: true,
                authorName: "Niels Søholm",
                text:"Nullam augue sem, varius quis tellus at, porttitor malesuada nulla. Vestibulum ipsum lacus, dictum ut eros et, egestas venenatis erat."
            }
        ];
        var messageElements = [];
        messages.forEach(function(message) {
            messageElements.push(<ChatMessage key={message.id} message={message} />)
        });

        return (
            <div>
                <div className="chat-body">
                    {messageElements}
                </div>
                <hr />
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Write a message..." />
                    <span className="input-group-btn">
                        <button className="btn btn-primary" type="button">Send</button>
                    </span>
                </div>
            </div>
        );
    }
});

module.exports = Chat;