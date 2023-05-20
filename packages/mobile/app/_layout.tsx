import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar'
import { ImageBackground } from 'react-native'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import * as SecureStore from 'expo-secure-store';

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import BgBlur from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

import { styled } from 'nativewind'
import { useEffect, useState } from "react";

const StyledStripes = styled(Stripes)

export default function DefaultLayout(){
    const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null)
    
    const [hasLoadedFonts] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
        BaiJamjuree_700Bold,
      })

      useEffect(() => {
        SecureStore.getItemAsync('token')
            .then(token => setIsAuthenticated(!!token))
      }, [])


    if (!hasLoadedFonts) return <SplashScreen />

    return (
        <ImageBackground
            source={BgBlur}
            className="flex-1 bg-gray-900 relative"
            imageStyle={{ position: 'absolute', left: '-100%' }}
        >

            <StyledStripes className='absolute left-2' />
            <StatusBar style="light" translucent />

            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'fade' }}>
                
                <Stack.Screen name="index" redirect={isAuthenticated}  />                
                <Stack.Screen name="memories"  />
                <Stack.Screen name="new"  />

            </Stack>

        </ImageBackground>
    )
}