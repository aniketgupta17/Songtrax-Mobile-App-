import React, { useState } from 'react'
import { Appearance, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { Button, colors } from '../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ProfileContext } from '../../context'

export const EditProfile = () => {
    const { currentUser, setCurrentUser } = ProfileContext()
    const { height } = useWindowDimensions()
    const { getColorScheme } = Appearance
    const mode = getColorScheme()
    const [image, setImage] = useState(currentUser?.image)
    const [userName, setUserName] = useState(null)

    const PickImage = async () => {
        try {
            const result = await launchImageLibrary({ mediaType: 'photo' });
            if (typeof result.assets[0] == 'object') {
                setImage(result.assets[0])
                setCurrentUser({ ...currentUser, image: result.assets[0] })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const styles = {
        wrapper: {
            flex: 1,
            backgroundColor: colors[mode].bgColor,
            flexDirection: "column",
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        title: {
            fontSize: 26,
            fontWeight: "bold",
            color: colors[mode].fgColor,
        },
        textInput: {
            marginTop: 20,
            backgroundColor: colors[mode].fgColorLighter,
            color: colors[mode].fgColor,
            textAlign: "center",
            height: 40,
            marginBottom: 100
        },
        subTitle: {
            fontSize: 14,
            fontWeight: "bold",
            color: colors[mode].fgColor,
        },
        emptyImage: {
            marginTop: 10,
            borderWidth: image ? 0 : 2,
            borderRadius: 10,
            borderColor: colors[mode].fgColorLighter,
            borderStyle: "dashed",
            height: height / 1.85
        },
        image: {
            width: "100%",
            height: '100%',
            borderRadius: 10
        }
    }
    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView>
                    <Text style={styles.title}>Edit Profile</Text>
                    <Text style={styles.subTitle}>Mirror, Mirror On The Wall...</Text>
                    <View>
                        <View style={styles.emptyImage} >
                            {image?.uri && <Image
                                style={styles.image}
                                source={{ uri: image?.uri }} />}
                        </View >
                    </View>
                    <Button onPress={PickImage} />
                    <TextInput
                        value={userName}
                        onChangeText={(text) => setUserName(text)}
                        onSubmitEditing={() => setCurrentUser({ ...currentUser, name: userName })}
                        style={styles.textInput}
                        placeholder='Name'
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})