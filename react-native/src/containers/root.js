/* @flow */

import React from "react-native";
import { Provider } from "react-redux";
import configureStore from "../store/configure-store";
import {Actions, Scene, Router} from 'react-native-router-flux';
import App from './app';
import MomentEditor from '../components/MomentEditor';
import MomentDetails from '../components/MomentDetails';

const store = configureStore();

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router sceneStyle={{paddingTop: 64}}>
          <Scene key="root" hideNavBar={false}>
            <Scene key="moments" component={App} title="Moments" duration={1} />
            <Scene key="momentEditor" component={MomentEditor()} title="Edit Moment" onLeft={Actions.pop} duration={1} />
            <Scene key="momentDetails" component={MomentDetails} title="Moment Details" onLeft={Actions.pop} duration={1} />
          </Scene>
        </Router>
      </Provider>
    );
  }
}

export default Root;
