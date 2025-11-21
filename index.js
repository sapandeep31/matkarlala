import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';
import WarningOverlay from './src/components/WarningOverlay';

// Register main app
registerRootComponent(App);

// Register overlay app for native overlay service
AppRegistry.registerComponent('WarningOverlayApp', () => WarningOverlay);

export default App;
