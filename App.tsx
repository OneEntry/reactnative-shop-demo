import './global.css';
import 'react-native-gesture-handler';
import React from 'react';
import {Router} from './src/navigation/navigators/Router';
import {LanguageProvider} from './src/providers/LanguageContext';
import {Provider} from 'react-redux';
import {setupStore} from './src/store/store';
import {MenuProvider} from 'react-native-popup-menu';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OpenDrawerProvider} from './src/providers/OpenDrawerContext';
import {ContentContextProvider} from './src/providers/ContentContext';
import {LogBox} from 'react-native';
import {AuthProvider} from './src/providers/AuthContext';
import Toast from 'react-native-toast-message';
import {KeyboardProvider} from 'react-native-keyboard-controller';

// Ignore all log warnings
LogBox.ignoreAllLogs();

// Setup Redux store
const store = setupStore();

// Main App component
function App(): JSX.Element {
  return (
    // Provide Redux store to the app
    <Provider store={store}>
      {/* Provide language to the app */}
      <LanguageProvider>
        {/* Authentication state */}
        <AuthProvider>
          {/* Load block which marker is system_content */}
          <ContentContextProvider>
            <MenuProvider>
              <OpenDrawerProvider>
                <SafeAreaProvider>
                  {/* Provide keyboard context to the app to properly display the inputs and avoid keyboard */}
                  <KeyboardProvider>
                    <Router />
                  </KeyboardProvider>
                  <Toast topOffset={60} />
                </SafeAreaProvider>
              </OpenDrawerProvider>
            </MenuProvider>
          </ContentContextProvider>
        </AuthProvider>
      </LanguageProvider>
    </Provider>
  );
}

// Export the App component as the default export
export default App;
