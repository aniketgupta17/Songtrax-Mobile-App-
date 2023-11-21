import React from 'react'
import { enableLatestRenderer } from 'react-native-maps';
import { LocContext, ProfileContexts } from './src/context';
import { MyApp } from './src/navigation';

const App = () => {

  enableLatestRenderer();
  return (
    <ProfileContexts>
      <LocContext>
        <MyApp />
      </LocContext>
    </ProfileContexts>
  )
}

export default App