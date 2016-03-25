import React from 'react-native'

let {
  Component,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image
} = React;

let styles = StyleSheet.create({
  row: {
    borderBottomColor: '#C8C8C8',
    borderBottomWidth: 0.5,
    padding: 10,
    flexDirection: 'row'
  },
  leftColumn: {
    width: 60
  },
  bodyColumn: {
    flex: 1,
    alignSelf: 'stretch'
  },
  avatar: {
    width: 50,
    height: 50
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  authorText: {
    fontSize: 10
  },
  bodyText: {
    fontSize: 12,
    color: '#000000'
  }
});

export default class MomentListItem extends Component {
  render() {
    let moment = this.props.moment;
    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor="#ffffff">
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Image source={require('../../img/niels.jpg')} style={styles.avatar} />
          </View>
          <View style={styles.bodyColumn}>
            <View style={styles.authorRow}>
              <Text style={styles.authorText}>{moment.authorName}</Text>
              <Text style={styles.authorText}>24h ago</Text>
            </View>
            <Text style={styles.bodyText}>{moment.text}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

MomentListItem.propTypes = {
  onPress: React.PropTypes.func,
  moment: React.PropTypes.object
};