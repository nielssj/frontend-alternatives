/* @flow */
/*eslint-disable prefer-const */

import React from "react-native";
import { connect } from "react-redux";
import { fetchData } from "../actions";
import MomentListItem from "../components/MomentListItem";
import MomentDetails from "../components/MomentDetails";
import ActionButton from "../components/ActionButton";
import MomentEditor from "../components/MomentEditor";

let {
  StyleSheet,
  Text,
  ScrollView,
  ListView,
  Image,
  View,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  root: {
    flex: 1
  },
  loading: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  componentDidMount() {
    this.props.dispatch(fetchData());
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(props.moments)
    });
  }

  renderRow(moment, sectionId, rowId) {
    return (<MomentListItem moment={moment} onPress={this.onItemPress.bind(this, moment['_id'])} />);
  }

  render() {
    if (this.state) {
      return (
        <View style={styles.root}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
          />
          <ActionButton onPress={this.onCreatePress.bind(this)} />
        </View>
      );
    } else {
      return (
        <View style={styles.loading}>
          <Image source={require('../../img/spinner.gif')} />
        </View>
      );
    }
  }

  onItemPress(momentId) {
    let navigator = this.props.navigator;
    navigator.push({
      component: MomentDetails(momentId),
      title: "Moment details"
    });
  }

  onCreatePress() {
    let navigator = this.props.navigator;
    navigator.push({
      component: MomentEditor(),
      title: "New Moment"
    });
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func,
  moments: React.PropTypes.array,
  isFetching: React.PropTypes.bool,
  comments: React.PropTypes.array,
  isFetchingComments: React.PropTypes.bool
};

App.defaultProps = {
  dispatch: () => {},
  isFetching: false,
  moments: [],
  isFetchingComments: false,
  comments: []
};

export default connect((state) => ({
  isFetching: state.data.isFetching,
  moments: state.data.moments,
  isFetchingComments: state.data.isFetchingComments,
  comments: state.data.comments
}))(App);
