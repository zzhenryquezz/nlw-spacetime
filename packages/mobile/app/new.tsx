import { Image, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from '@expo/vector-icons/Feather'

import NlwLogo from '../src/assets/nlw-logo.svg'
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { api } from "../src/lib/api";

export default function NewMemory() {

    const router = useRouter()

    const { bottom, top } = useSafeAreaInsets()

    const [preview, setPreview] = useState<string | null>(null)
    const [content, setContent] = useState('')
    const [isPublic, setIsPublic] = useState(false)

    async function openMediaPicker(){
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (result.assets[0]) {
            setPreview(result.assets[0].uri);
        }
    }

    async function handleUpload(){
        const formData = new FormData()

        formData.append('file', {
            uri: preview,
            name: 'image.jpg',
            type: 'image/jpeg',
        } as any)
        
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return response.data.fileURL
    }


    async function handleSubmit(){
        const token = await SecureStore.getItemAsync('token')

        let coverUrl = null

        if (preview) {
            coverUrl = await handleUpload()
        }

        await api.post('/memories', {
            content,
            isPublic,
            coverUrl
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        router.push('/memories')
    }


    return (
        <ScrollView        
            className="flex-1 px-8"
            contentContainerStyle={{
                paddingTop: top,
                paddingBottom: bottom
            }}
        
        >
            <View className="mt-4 flex-row items-center justify-between">

                <NlwLogo />

                <Link href="/memories" asChild>
                    <TouchableOpacity  className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-500">
                        <Icon name="arrow-left" size={16} color="#fff" />
                    </TouchableOpacity>
                </Link>
            </View>

            <View className="mt-6 space-y-6">
                <View className="flex-row items-center gap-2">
                    <Switch
                        value={isPublic}
                        onValueChange={setIsPublic}
                        trackColor={{ false: '#767577', true: '#372568' }}
                        thumbColor={isPublic ? '#9b79ea' : '#9393a0'}
                    />

                    <Text className="font-bold text-base text-gray-200">
                        Tornar memória pública
                    </Text>
                </View>

                <TouchableOpacity activeOpacity={0.7} className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-gray-800" onPress={openMediaPicker}>
                    {preview ? (
                        <Image source={{ uri: preview }} className="h-full w-full rounded-lg object-cover" />
                    ) : (<View className="flex-row items-center gap-2">
                            <Icon name="image" size={24} color="#fff" />
                            <Text className="font-bold text-sm text-gray-200">
                                Adicionar foto ou video de capa
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    multiline
                    className="p-0 font-body text-lg text-gray-50"
                    placeholderTextColor='#56565a'
                    placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
                    value={content}
                    onChangeText={setContent}
                />

                <TouchableOpacity
                    className='items-center self-end rounded-full bg-green-500 px-5 py-2 mb-4'
                    activeOpacity={0.7}
                    onPress={handleSubmit}
                >
                    <Text className='font-alt text-sm uppercase text-black' >
                        Salvar
                    </Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
    )
}