import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar'
import { Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from 'expo-secure-store';

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import NlwLogo from '../src/assets/nlw-logo.svg'

import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from '../src/lib/api'

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/e475958aaf0ebb8b3f81',
};

export default function App() {
const router = useRouter()

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'e475958aaf0ebb8b3f81',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) { 

    const response = await api.post('/register', {
        code
      })

    const { token } = response.data

    SecureStore.setItemAsync('token', token)

    router.push('/memories')

  }

  useEffect(() => {
    if (response?.type === 'success' && response.params.code) {
      const { code } = response.params;

      handleGithubOAuthCode(code)
    }
  }, [response]);

  if (!hasLoadedFonts) return null

  return (
    <View className="flex-1 items-center justify-center px-8 py-10">

      <View className='flex-1 items-center justify-center gap-6'>
        <NlwLogo />

        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50' >Sua cápsula do tempo</Text>

          <Text className='text-center font-body text-base leading-relaxed text-gray-100' >Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!</Text>
        </View>

        <TouchableOpacity
          className='rounded-full bg-green-500 px-5 py-2'
          activeOpacity={0.7}
          onPress={() => signInWithGithub()}
        >
          <Text className='font-alt text-sm uppercase text-black' >
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>
        Feito com 💜 no NLW da Rocketseat
      </Text>

      <StatusBar style="light" translucent />
    </View>
  )
}
