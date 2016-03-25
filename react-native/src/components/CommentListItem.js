import React from 'react-native'

let {
  Component,
  StyleSheet,
  View,
  Text
} = React;

let styles = StyleSheet.create({
  commentWrapper: {
    paddingBottom: 10
  },
  commentBodyText: {
    fontSize: 10,
    color: '#000000'
  }
});

export default class CommentListItem extends Component {
  render() {
    let comment = this.props.comment;
    return (
      <View style={styles.commentWrapper}>
        <Text style={styles.commentBodyText}>
          {comment.text}
        </Text>
      </View>
    )
  }
}

CommentListItem.propTypes = {
  comment: React.PropTypes.object
};