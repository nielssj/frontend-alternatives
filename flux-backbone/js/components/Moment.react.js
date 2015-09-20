var React = require('react');
var Comment = require("./Comment.react");
var AppActions = require("../actions/AppActions");

var Moment = React.createClass({

    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    getInitialState() {
        var commentsCollection = this.props.data.getComments();
        commentsCollection.on("sync", this._onCommentsChange);
        commentsCollection.on("destroy", this._onCommentsChange);

        return {
            showCommentInput: false,
            commentCollection: commentsCollection,
            comments: []
        };
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
        var makePostCommentFunc = this._makePostCommentFunc;
        var commentElements = [];
        rootNodes.forEach(function(node) {
            commentElements.push(
                <Comment key={node.comment.get("id")}
                         comment={node.comment}
                         children={node.children}
                         makePostFunction={makePostCommentFunc}/>
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

        // Return moment with any resulting comments
        return (
            <div className="moment">
                <hr />
                <p>{this.props.data.get("authorName")}</p>
                <p>
                    <span>{this.props.data.get("text")} </span>
                    <span onClick={this._onCommentClick} className="comment-action noselect">comment</span>
                </p>
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

    // List for changes to all comments
    _onCommentsChange: function() {
        this.setState({
            comments: this.state.commentCollection.toArray()
        })
    },
    // Post new comment
    _onNewCommentPost: function() {
        var postCommentFunc = this._makePostCommentFunc(null);
        var text = this.refs.newCommentTextInput.getDOMNode().value;
        postCommentFunc(text);

        // Clear and hide input
        this.setState({
            newCommentText: "",
            showCommentInput: false
        });
    },

    // Make comment post function, to be used by Moment or sub-comments
    _makePostCommentFunc: function(parentId) {
        var commentCollection = this.state.commentCollection;
        var parentMoment = this.props.data.get("_id");
        return function(text) {
            commentCollection.create({
                text: text,
                parentMoment: parentMoment,
                parent: parentId
            });
        }
    }

});

module.exports = Moment;