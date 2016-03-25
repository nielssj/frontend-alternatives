import React from 'react-native'

let {
  Component,
  StyleSheet,
  TouchableHighlight,
  Image
} = React;

let styles = StyleSheet.create({
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#c8c8c8',
    position: 'absolute',
    bottom: 15,
    right: 15,
    justifyContent: 'center',
    elevation: 2
  },
  icon: {
    width: 30,
    height: 30,
    alignSelf: 'center'
  }
});

export default class ActionButton extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor="#ffffff" style={styles.actionButton}>
        <Image source={require('../../img/draw2.png')} style={styles.icon} />
      </TouchableHighlight>
    )
  }
}

ActionButton.propTypes = {
  onPress: React.PropTypes.func
};