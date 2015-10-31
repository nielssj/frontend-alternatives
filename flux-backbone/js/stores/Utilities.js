var _ = require('underscore');

var Utilities = {
    parseCouch: function(data, options) {
        if( data.hasOwnProperty("rows") && _.isArray(data.rows) ) {
            return _.map(data.rows, function(doc) {
                doc.value.id = doc.id;
                doc.value.rev = doc.value["_rev"];
                return doc.value;
            });
        } else {
            return data;
        }
    }
}

module.exports = Utilities;