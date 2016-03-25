import React from 'react-native'
import {connect} from "react-redux";
import { createMoment } from "../actions";

let {
  Component,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Image
} = React;

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    justifyContent: 'space-between'
  },
  row: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#ffffff'
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
    color: '#000000',
    padding: 0,
    textAlignVertical: 'top'    /* Android-only */
  },
  footer: {
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  sendButton: {
    width: 70,
    height: 40,
    backgroundColor: '#c8c8c8',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

class MomentEditor extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Image source={require('../../img/niels.jpg')} style={styles.avatar} />
          </View>
          <View style={styles.bodyColumn}>
            <View style={styles.authorRow}>
              <Text style={styles.authorText}>Niels Søholm</Text>
            </View>
            <TextInput
              style={styles.bodyText}
              placeholder='Describe your moment..'
              multiline={true}
              numberOfLines={4}
              underlineColorAndroid='#ffffff'
              placeholderTextColor='#000000'
              onChangeText={(text) => this.setState({text:text})}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableHighlight onPress={this.onPostPress.bind(this)} underlayColor="#ffffff" style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Post</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  onPostPress() {
    let newMoment = {
      authorId: "9ab95fb7-f725-403a-a17f-8f0086faf4e", // FIXME: Somewhere else add this based on authenticated account
      authorName: "Niels Søholm",
      text: this.state.text
    };
    this.props.dispatch(createMoment(newMoment));

  }
}

MomentEditor.propTypes = {
  dispatch: React.PropTypes.func,
  moment: React.PropTypes.object
};

MomentEditor.defaultProps = {
  dispatch: () => {},
  moment: {}
};

const mapStateToProps = (momentId, state) => {
  if(momentId) {
    return {
      moment: state.data.moments.find(m => m['_id'] == momentId)
    }
  } else {
    return {
      moment: {}
    }
  }
};

export default (momentId) =>
  connect(mapStateToProps.bind(this, momentId))(MomentEditor);
