var React = require('react');
var CommentSection = require("./CommentSection.react");
var AppActions = require("../actions/AppActions");

var ENTER_KEY_CODE = 13;

var Moment = React.createClass({

    propTypes: {
        moment: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            editMode: false,
            showComments: false
        };
    },

    render: function() {

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
                            <span> Comments</span>
                        </button>
                    </div>
                    {momentControls}
                </div>
                <CommentSection show={this.state.showComments} collection={this.props.moment.comments} parent={this.props.moment.id} />
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

    // Delete moment
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

    // Show/hide comments view
    _toggleCommentsView: function() {
        // Initiate fetch of comments
        if(!this.state.showComments) {
            AppActions.fetchCommentsFor(this.props.moment.id);
        }
        // Unfold comment section
        this.setState({
            showComments: !this.state.showComments
        });
    }
});

module.exports = Moment;