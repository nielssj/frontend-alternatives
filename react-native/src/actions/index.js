/* @flow */
/*global setTimeout*/

export const REQUEST_DATA = "REQUEST_DATA";
export const RECEIVE_DATA = "RECEIVE_DATA";
export const REQUEST_COMMENTS = "REQUEST_COMMENTS";
export const RECEIVE_COMMENTS = "RECEIVE_COMMENTS";
export const POST_MOMENT = "POST_MOMENT";
export const POSTED_MOMENT =  "POSTED_MOMENT";
export const DELETE_MOMENT = "DELETE_MOMENT";
export const DELETED_MOMENT = "DELETED_MOMENT";

export const requestData = (): Object => {
  return {
    type: REQUEST_DATA
  }
};

export const receiveData = (data: Object): Object => {
  return {
    type: RECEIVE_DATA,
    data
  }
};

export const requestComments = (): Object => {
  return {
    type: REQUEST_COMMENTS
  }
};

export const receiveComments = (comments: Object): Object => {
  return {
    type: RECEIVE_COMMENTS,
    comments
  }
};

export const postMoment = (): Object => {
  return {
    type: POST_MOMENT
  }
};

export const postedMoment = (moment: Object): Object => {
  return {
    type: POSTED_MOMENT,
    moment
  }
};

export const deleteMoment = (): Object => {
  return {
    type: DELETE_MOMENT
  }
};

export const deletedMoment = (moment: Object): Object => {
  return {
    type: DELETED_MOMENT,
    moment
  }
};

export const fetchData = (): Function => {
  return (dispatch) => {
    dispatch(requestData());
    return fetch("http://192.168.0.15:5984/moments/_design/example/_view/author")
      .then(response => response.json())
      .then(responseData => {
        var values = responseData.rows.map(row => row.value);
        dispatch(receiveData(values));
      });
  };
};

export const fetchComments = (momentId): Function => {
  return (dispatch) => {
    dispatch(requestComments());
    let url = `http://192.168.0.15:5984/comments/_design/example/_view/by_parent?key="${momentId}"`;
    return fetch(url)
      .then(response => response.json())
      .then(responseData => {
        var comments = responseData.rows.map(row => row.value);
        dispatch(receiveComments(comments))
      })
  };
};

export const createMoment = (moment): Function => {
  return (dispatch) => {
    dispatch(postMoment());
    let url = `http://192.168.0.15:5984/moments`;
    return fetch(url, {
      method: 'post',
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(moment)
    })
      .then(response => response.json())
      .then(responseData => {
        moment['_id'] = responseData.id;
        moment['_rev'] = responseData.rev;
        dispatch(postedMoment(moment));
      })
  }
};

export const removeMoment = (moment): Function => {
  return (dispatch) => {
    dispatch(deleteMoment);
    let url = `http://192.168.0.15:5984/moments/${moment['_id']}?rev=${moment['_rev']}`;
    return fetch(url, { method: 'delete' })
      .then(response => response.json())
      .then(responseData => {
        dispatch(deletedMoment(moment))
      })
  };
};