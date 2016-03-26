import React from 'react-native'
import {connect} from "react-redux";
import {
  fetchComments,
  removeMoment
} from '../actions';
import CommentListItem from './CommentListItem';
import MomentEditor from './MomentEditor';

let {
  Component,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight
} = React;

let styles = StyleSheet.create({
  row: {
    borderBottomColor: '#C8C8C8',
    borderBottomWidth: 0.5,
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
    color: '#000000'
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
    paddingBottom: 10
  },
  editIcons: {
    width: 20,
    height: 20,
    marginLeft: 20
  },
  commentsSection: {
    backgroundColor: '#ffffff'
  },
  commentsTitle: {
    padding: 10
  },
  commentsTitleText: {
    fontSize: 12
  },
  commentList: {
    padding: 10
  }
});

class MomentDetails extends Component {
  componentDidMount() {
    this.props.dispatch(fetchComments(this.props.momentId));
  }

  renderComments() {
    if(this.props.comments) {
      let momentComments = this.props.comments.filter(c => c['parentMoment'] == this.props.momentId);
      return momentComments.map(comment =>
        (<CommentListItem key={comment['_id']} comment={comment} />));
    } else {
      return [];
    }
  }

  render() {
    let moment = this.props.moments.find(m => m['_id'] == this.props.momentId);
    return (
      <View style={this.props.sceneStyle}>
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
            <View style={styles.editRow}>
              <TouchableHighlight onPress={this.onEditPress.bind(this)} underlayColor="#ffffff">
                <Image source={require('../../img/draw3.png')} style={styles.editIcons} />
              </TouchableHighlight>
              <TouchableHighlight onPress={this.onDeletePress.bind(this)} underlayColor="#ffffff">
                <Image source={require('../../img/trash.png')} style={styles.editIcons} />
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={styles.commentsSection}>
          <View style={styles.commentsTitle}>
            <Text style={styles.commentsTitleText}>Comments</Text>
          </View>
          <View style={styles.commentList}>
            {this.renderComments()}
          </View>
        </View>
      </View>
    )
  }

  onEditPress() {
    let navigator = this.props.navigator;
    navigator.push({
      component: MomentEditor(),
      title: "Edit Moment"
    });
  }

  onDeletePress() {
    this.props.dispatch(removeMoment(this.props.momentId));
  }
}

MomentDetails.propTypes = {
  dispatch: React.PropTypes.func,
  isFetchingComments: React.PropTypes.bool,
  moment: React.PropTypes.object,
  comments: React.PropTypes.array
};

MomentDetails.defaultProps = {
  dispatch: () => {},
  isFetchingComments: false,
  moments: [],
  comments: []
};

const mapStateToProps = (state) => {
  return {
    isFetchingComments: state.data.isFetchingComments,
    moments: state.data.moments,
    comments: state.data.comments
  }
};

export default connect(mapStateToProps)(MomentDetails);
