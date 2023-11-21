import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Route } from '../constants/Routs';
import { NearSamples, Sample } from '../screens';

const { Navigator, Screen } = createNativeStackNavigator();

export const NearStack = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name={Route.NEAR_SAMPLES} component={NearSamples} />
            <Screen name={Route.SAMPLE} component={Sample} />
        </Navigator>
    )
}

export default NearStack