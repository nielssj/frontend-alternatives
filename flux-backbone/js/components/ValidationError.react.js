var React = require('react');
var ReactPropTypes = React.PropTypes;

var ValidationError = React.createClass({

    propTypes: {
        error: React.PropTypes.object
    },

    render: function() {

        if(this.props.error) {
            return (
                <div className="alert alert-danger comment-validation-error" for="newCommentTextInput">
                    <strong>Whoops!</strong>
                    <span> {this.props.error.text}</span>
                </div>
            );
        } else {
            return null;
        }

    }
});

module.exports = ValidationError;