var React = require('react');
var d3 = require('d3');
var ReactPropTypes = React.PropTypes;
var Moment = require("./Moment.react");

var Stream = React.createClass({

    propTypes: {
        moments: ReactPropTypes.array.isRequired
    },

    render: function() {

        // Prepare moment elements
        var momentElements = [];
        this.props.moments.forEach(function(moment) {
            momentElements.push(
                <Moment key={moment.cid} moment={moment}></Moment>
            );
        });

        // Return resulting elements
        return (
            <div id="stream">
                {momentElements}
            </div>
        );
    }

});

module.exports = Stream;