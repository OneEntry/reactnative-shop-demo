import './global.css';
import 'react-native-gesture-handler';
import React from 'react';
import {LanguageProvider} from './src/state/contexts/LanguageContext';
import {Provider} from 'react-redux';
import {setupStore} from './src/state/store';
import {MenuProvider} from 'react-native-popup-menu';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OpenDrawerProvider} from './src/state/contexts/OpenDrawerContext';
import {LogBox} from 'react-native';
import {AuthProvider} from './src/state/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import MainNavigator from './src/navigation/navigators/MainNavigator';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// Ignore all log warnings
LogBox.ignoreAllLogs();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // Cache data for 1 minute
    },
  },
});

// Setup Redux state
const store = setupStore();

// Main App component
function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Provide Redux state to the app */}
      <Provider store={store}>
        {/* Provide language to the app */}
        <LanguageProvider>
          {/* Authentication state */}
          <AuthProvider>
            {/* Load block which marker is system_content */}
            <MenuProvider>
              <OpenDrawerProvider>
                <SafeAreaProvider>
                  {/* Provide keyboard context to the app to properly display the inputs and avoid keyboard */}
                  <KeyboardProvider>
                    <MainNavigator />
                  </KeyboardProvider>
                  <Toast topOffset={60} />
                </SafeAreaProvider>
              </OpenDrawerProvider>
            </MenuProvider>
          </AuthProvider>
        </LanguageProvider>
      </Provider>
    </QueryClientProvider>
  );
}

// Export the App component as the default export
export default App;
