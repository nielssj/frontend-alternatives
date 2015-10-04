var React = require('react');
var Comment = require("./Comment.react");
var ValidationError = require("./ValidationError.react");
var AppActions = require("../actions/AppActions");

var ENTER_KEY_CODE = 13;

var CommentSection = React.createClass({

    propTypes: {
        show: React.PropTypes.bool.isRequired,
        parent: React.PropTypes.string.isRequired,
        collection: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            editMode: false,
            showComments: false,
            comments: null
        };
    },

    componentDidMount: function() {
        // Listen for changes in comments
        this.props.collection.on("sync", this._onCommentsChange);
        this.props.collection.on("destroy", this._onCommentsChange);
    },

    componentWillUnmount: function() {
        // Stop listening for changes in comments
        this.props.collection.off("sync", this._onCommentsChange);
        this.props.collection.off("destroy", this._onCommentsChange);
    },

    render: function() {
        // Comment list
        var commentListElement = null;
        if(this.state.comments) {
            var commentTree = { };
            var rootNodes = [];

            // Prepare comment tree hierarchy
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

            // Prepare comment elements, if any.
            var commentElements = [];
            rootNodes.forEach(function(node) {
                commentElements.push(
                    <Comment key={node.comment.get("id")}
                             comment={node.comment}
                             children={node.children} />
                );
            });

            commentListElement = <ul className="comment-list-root">{commentElements}</ul>;
        } else {
            commentListElement = <div className="loader" />;
        }

        // Rendering
        if(this.props.show) {
            return (
                <div>
                    <hr className="moment-separator" />
                    {commentListElement}
                    <ValidationError error={this.state.validationError} />
                    <div className="input-group new-comment-input-root">
                        <input autoFocus type="text" ref="newCommentTextInput" value={this.state.newCommentText} onKeyDown={this._onPostKey} onChange={this._onNewCommentChange} className="form-control" placeholder="Make a comment..." />
                        <span onClick={this._onPost} className="input-group-btn">
                            <button className="btn btn-default" type="button">Post!</button>
                        </span>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    },

    // List for changes to all comments
    _onCommentsChange: function() {
        this.setState({
            comments: this.props.collection.toArray()
        })
    },

    // Save changes from new comment field in state
    _onNewCommentChange: function(event) {
        this.setState({
            newCommentText: event.target.value
        });
    },

    // Enter key pressed when new comment field in focus (trigger post)
    _onPostKey: function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            this._onPost();
        }
    },

    // Post new comment
    _onPost: function() {
        this.setState({
            validationError: null
        });

        AppActions.createComment(
            {
                parentMoment: this.props.parent,
                text: this.state.newCommentText
            },
            this._onInvalidPost
        );

        this.setState({
            newCommentText: ""
        });
    },

    // Show validation error
    _onInvalidPost: function(validationError) {
        this.setState({
            validationError: validationError
        });
    }

});

module.exports = CommentSection;