var React = require('react');

var Comment = React.createClass({

    propTypes: {
        comment: React.PropTypes.object.isRequired,
        makePostFunction: React.PropTypes.func.isRequired,
        children: React.PropTypes.array
    },

    getInitialState: function() {
        return {
            showCommentInput: false
        }
    },

    render: function() {
        var makePostFunction = this.props.makePostFunction;

        var childCommentElements = [];
        this.props.children.forEach(function(child) {
            childCommentElements.push(
                <Comment key={child.comment.get("id")}
                         comment={child.comment}
                         children={child.children}
                         makePostFunction={makePostFunction}/>
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
        var headers = {
            "If-Match": this.props.comment.get("rev")
        };
        this.props.comment.destroy({headers:headers});
    },

    // Post a new comment
    _onPostClick: function() {
        // Post comment with correct parentId
        var id = this.props.comment.get("id");
        var postFunction = this.props.makePostFunction(id);
        var text = this.refs.newCommentTextInput.getDOMNode().value;
        postFunction(text);

        // Clear and hide input
        this.setState({
            newCommentText: "",
            showCommentInput: false
        });
    }

});

module.exports = Comment;