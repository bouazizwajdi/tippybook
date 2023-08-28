import React from 'react';
import AppNavigator from "./src/navigation/navigation";
//import { NativeBaseProvider, Text, Box } from 'native-base';

const App = () => {
  console.disableYellowBox = true;
  return (
    // <NativeBaseProvider>
      <AppNavigator/>
     // </NativeBaseProvider>
  );
};

export default App;
