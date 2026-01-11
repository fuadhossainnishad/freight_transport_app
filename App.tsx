/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import RootApp from './src/app/App';

function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider className='flex-1 bg-white'>
      {/* <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      /> */}

      <RootApp />
    </SafeAreaProvider>
  );
}


export default App;
