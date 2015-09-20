var React = require('react');
var AppActions = require("../actions/AppActions");

var Comment = React.createClass({

    propTypes: {
        comment: React.PropTypes.object.isRequired,
        children: React.PropTypes.array
    },

    getInitialState: function() {
        return {
            showCommentInput: false
        }
    },

    render: function() {
        var childCommentElements = [];
        this.props.children.forEach(function(child) {
            childCommentElements.push(
                <Comment key={child.comment.get("id")}
                         comment={child.comment}
                         children={child.children} />
            );
        });

        var commentInput;
        if(this.state.showCommentInput) {
            commentInput =
                (<p>
                    <input type="text" ref="newCommentTextInput" />
                    <input type="button" value="Post" onClick={this._onPostClick} />
                </p>);
        }

        return (
            <li className="comment">
                <p>
                    <span>{this.props.comment.get("text")} </span>
                    <span onClick={this._onRespondClick} className="comment-action noselect">respond</span>
                    <span> </span>
                    <span onClick={this._onDeleteClick} className="comment-action noselect">delete</span>
                </p>
                {commentInput}
                <ul>
                    {childCommentElements}
                </ul>
            </li>
        );
    },

    // Show/hide comment input
    _onRespondClick: function() {
        this.setState({
            showCommentInput: !this.state.showCommentInput
        });
    },

    _onDeleteClick: function() {
        AppActions.deleteComment(this.props.comment);
    },

    // Post a new comment
    _onPostClick: function() {
        // Emit creation action
        AppActions.createComment({
            parent: this.props.comment.get("id"),
            parentMoment: this.props.comment.get("parentMoment"),
            text: this.refs.newCommentTextInput.getDOMNode().value
        });

        // Clear and hide input
        this.setState({
            showCommentInput: false
        });
    }

});

module.exports = Comment;