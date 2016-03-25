/* @flow */

import {combineReducers} from "redux";
import * as types from "../actions";

const data = (state = {
  isFetching: false,
  moments: [],
  isFetchingComments: false,
  comments: []
}, action) => {
  switch (action.type) {
    case types.REQUEST_DATA:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        moments: action.data
      });
    case types.REQUEST_COMMENTS:
      return Object.assign({}, state, {
        isFetchingComments: true
      });
    case types.RECEIVE_COMMENTS:
      return Object.assign({}, state, {
        comments: action.comments,
        isFetchingComments: false
      });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  data
});

export default rootReducer;
