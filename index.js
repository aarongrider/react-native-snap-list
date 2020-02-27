/**
 * @format
 */

import App from './src/App';
import {AppRegistry} from 'react-native';
import AppWithHooks from './src/AppWithHooks';
import Example from './src/Example/bottomSheet';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Example);
