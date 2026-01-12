/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootApp from './src/app/App';
import { NavigationContainer } from '@react-navigation/native';

function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider className="flex-1 bg-white">
      {/* <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      /> */}
      <NavigationContainer>
        <RootApp />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
