var React = require('react');
var Comment = require("./Comment.react");
var AppActions = require("../actions/AppActions");

var ENTER_KEY_CODE = 13;

var Moment = React.createClass({

    propTypes: {
        moment: React.PropTypes.object.isRequired
    },

    getInitialState() {
        AppActions.fetchCommentsFor(this.props.moment.id);
        return {
            editMode: false,
            showComments: false,
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

        // Moment body
        var momentBody;
        if(!this.state.editMode) {
            // Normal mode
            momentBody = (
                <p><span>{this.props.moment.get("text")} </span></p>
            );
        } else {
            // Edit mode
            momentBody = (
                <p><textarea autoFocus ref="editMomentTextInput" onKeyDown={this._onSaveKey} defaultValue={this.props.moment.get("text")} className="form-control" rows="3" /></p>
            );
        }

        // Moment controls (lower-right)
        var momentControls;
        if(!this.state.editMode) {
            // Normal mode
            momentControls = (
                <div className="btn-group pull-right moment-buttons" role="group" aria-label="...">
                    <button onClick={this._onEditClick} type="button" className="btn btn-default">
                        <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                    </button>
                </div>
            );
        } else {
            // Edit mode
            momentControls = (
                <div className="btn-group pull-right moment-buttons" role="group" aria-label="...">
                    <button onClick={this._onSave} type="button" className="btn btn-default">
                        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        <span> Save</span>
                    </button>
                    <button onClick={this._onDeleteClick} type="button" className="btn btn-default">
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        <span> Delete</span>
                    </button>
                    <button onClick={this._onCancelClick} type="button" className="btn btn-default active">
                        <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                    </button>
                </div>
            );
        }

        // Comment section
        var seperator;
        var commentSection;
        if(this.state.showComments) {
            // Horizontal separator to rest of moment
            seperator = (<hr className="moment-separator" />);

            // New comment validation error
            var validationErrorElement;
            if(this.state.validationError) {
                validationErrorElement = (
                    <div className="alert alert-danger comment-validation-error" for="newCommentTextInput">
                        <strong>Whoops!</strong>
                        <span> {this.state.validationError.text}</span>
                    </div>
                );
            }

            // Actual comment list and new comment input
            commentSection = (
                <div>
                    <ul className="comment-list-root">{commentElements}</ul>
                    {validationErrorElement}
                    <div className="input-group new-comment-input-root">
                        <input autoFocus type="text" ref="newCommentTextInput" value={this.state.newCommentText} onKeyDown={this._onPostKey} onChange={this._onNewCommentChange} className="form-control" placeholder="Make a comment..." />
                        <span onClick={this._onPost} className="input-group-btn">
                            <button className="btn btn-default" type="button">Post!</button>
                        </span>
                    </div>
                </div>
            )
        } else {
            seperator = null;
            commentSection = null;
        }

        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <strong>{this.props.moment.get("authorName")}</strong>
                    <small> - 2 hours ago</small>
                </div>
                <div className="panel-body">
                    {momentBody}
                </div>
                <div className="moment-footer clearfix">
                    <div className="pull-left moment-buttons">
                        <button onClick={this._toggleCommentsView} type="button" className="btn btn-default">
                            <span className="glyphicon glyphicon-comment" aria-hidden="true"></span>
                            <span> Comments ({this.state.comments.length})</span>
                        </button>
                    </div>
                    {momentControls}
                </div>
                {seperator}
                {commentSection}
            </div>
        );
    },

    // Start edit (enable edit-mode)
    _onEditClick: function() {
        this.setState({
            editMode: true,
            showComments: false // Hide comment view, if it's open, to reduce UI clutter
        });
    },

    // Cancel edits (disable edit-mode)
    _onCancelClick: function() {
        this.setState({
            editMode: false
        });
    },

    _onDeleteClick: function() {
        AppActions.deleteMoment(this.props.moment);
    },

    // Save key (enter) pressed while focus in input field
    _onSaveKey: function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            this._onSave();
        }
    },

    // Save edits
    _onSave: function() {
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

    _toggleCommentsView: function() {
        this.setState({
            showComments: !this.state.showComments
        });
    },

    // List for changes to all comments
    _onCommentsChange: function() {
        this.setState({
            comments: this.props.moment.comments.toArray()
        })
    },

    _onNewCommentChange: function(event) {
        this.setState({
            newCommentText: event.target.value
        });
    },

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
                parentMoment: this.props.moment.id,
                text: this.state.newCommentText,
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

module.exports = Moment;