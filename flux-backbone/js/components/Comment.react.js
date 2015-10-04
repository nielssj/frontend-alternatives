var React = require('react');
var AppActions = require("../actions/AppActions");

var ENTER_KEY_CODE = 13;

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
        // Prepare child comments
        var childCommentElements = [];
        this.props.children.forEach(function(child) {
            childCommentElements.push(
                <Comment key={child.comment.get("id")}
                         comment={child.comment}
                         children={child.children} />
            );
        });

        // New comment input field
        var commentInput;
        if(this.state.showCommentInput) {
            commentInput = (
                <div className="input-group new-comment-input">
                    <input autoFocus type="text" ref="newCommentTextInput" onKeyDown={this._onPostKey} className="form-control" placeholder="Make a comment..." />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button">Post!</button>
                    </span>
                </div>
            );
        }

        // Render
        return (
            <li className="comment">
                <p>
                    <strong className="text-primary">{this.props.comment.get("authorName")}: </strong>
                    <span>{this.props.comment.get("text")}</span>
                    <small className="text-muted"> - 6 minutes ago</small>
                    <small> - </small>
                    <small onClick={this._onRespondClick} className="text-primary noselect comment-action">
                        <span className="glyphicon glyphicon-comment" aria-hidden="true"></span>
                        <span> respond</span>
                    </small>
                    <small> - </small>
                    <small onClick={this._onDeleteClick} className="text-primary noselect comment-action">
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        <span> delete</span>
                    </small>
                </p>
                {commentInput}
                <ul className="comment-list-sub">
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

    // Delete comment
    _onDeleteClick: function() {
        AppActions.deleteComment(this.props.comment);
    },

    // Enter key pressed when new comment field in focus (trigger post)
    _onPostKey: function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            this._onPost();
        }
    },

    // Post a new comment
    _onPost: function() {
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