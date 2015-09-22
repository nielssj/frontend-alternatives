var React = require('react');
var Comment = require("./Comment.react");
var AppActions = require("../actions/AppActions");

var Moment = React.createClass({

    propTypes: {
        moment: React.PropTypes.object.isRequired
    },

    getInitialState() {
        AppActions.fetchCommentsFor(this.props.moment.id);
        return {
            showCommentInput: false,
            editMode: false,
            comments: []
        };
    },

    componentDidMount: function() {
        // Listen for changes in comments
        this.props.moment.comments.on("sync", this._onCommentsChange);
        this.props.moment.comments.on("destroy", this._onCommentsChange);
    },

    componentWillUnmount: function() {
        // Stop listening for changes in comments
        this.props.moment.comments.off("sync", this._onCommentsChange);
        this.props.moment.comments.off("destroy", this._onCommentsChange);
    },

    render: function() {
        // Prepare comment tree hierarchy
        var commentTree = { };
        var rootNodes = [];
        this.state.comments.forEach(function(comment) {
            var node = {
                "comment": comment,
                "children": []
            };

            // Add node to tree
            commentTree[comment.id] = node;

            // If it has no comment parent, it most be a root comment (To be rendered by this moment)
            if(!comment.has("parent")) {
                rootNodes.push(node);
            }
        });
        for (var key in commentTree) {      // Note: The body of this loop could technically be a part of the forEach above, however this would assume that comments are always retrieved sorted in an order where parent comments come before all their children.
            var node = commentTree[key];
            var comment = node.comment;
            if(comment.has("parent")) {
                commentTree[comment.get("parent")].children.push(node);
            }
        }

        // Prepare comments, if any.
        var commentElements = [];
        rootNodes.forEach(function(node) {
            commentElements.push(
                <Comment key={node.comment.get("id")}
                         comment={node.comment}
                         children={node.children} />
            );
        });

        // Prepare comment input, if shown
        var commentInput;
        if(this.state.showCommentInput) {
            commentInput =
                (<p>
                    <input type="text" ref="newCommentTextInput" />
                    <input type="button" value="Post" onClick={this._onNewCommentPost} />
                </p>);
        }

        var momentBody;
        if(!this.state.editMode) {
            // Normal mode
            momentBody = (
                <p>
                    <span>{this.props.moment.get("text")} </span>
                    <span onClick={this._onEditClick} className="comment-action noselect">edit</span>
                    <span> </span>
                    <span onClick={this._onCommentClick} className="comment-action noselect">comment</span>
                </p>
            );
        } else {
            // Edit mode
            momentBody = (
                <p>
                    <input type="text" ref="editMomentTextInput" defaultValue={this.props.moment.get("text")} />
                    <span> </span>
                    <span onClick={this._onCancelClick} className="comment-action noselect">cancel</span>
                    <span> </span>
                    <span onClick={this._onSaveClick} className="comment-action noselect">save</span>
                </p>
            );
        }

        // Return moment with any resulting comments
        return (
            <div className="moment">
                <hr />
                <p>{this.props.moment.get("authorName")}</p>
                {momentBody}
                {commentInput}
                <ul className="moment-comments">
                    {commentElements}
                </ul>
            </div>
        );
    },

    // Show new comment input
    _onCommentClick: function(resp) {
        this.setState({
            showCommentInput: !this.state.showCommentInput
        });
    },

    // Start edit (enable edit-mode)
    _onEditClick: function() {
        this.setState({
            editMode: true,
            showCommentInput: false // Hide comment input, if it's open, to reduce UI clutter
        });
    },

    // Cancel edits (disable edit-mode)
    _onCancelClick: function() {
        this.setState({
            editMode: false
        });
    },

    // Save edits
    _onSaveClick: function() {
        AppActions.updateMoment(
            this.props.moment.id,
            {
                text: this.refs.editMomentTextInput.getDOMNode().value
            }
        );

        this.setState({
            editMode: false
        });
    },

    // List for changes to all comments
    _onCommentsChange: function() {
        this.setState({
            comments: this.props.moment.comments.toArray()
        })
    },
    // Post new comment
    _onNewCommentPost: function() {
        AppActions.createComment({
            parentMoment: this.props.moment.id,
            text: this.refs.newCommentTextInput.getDOMNode().value
        });

        // Clear and hide input
        this.setState({
            showCommentInput: false
        });
    }

});

module.exports = Moment;