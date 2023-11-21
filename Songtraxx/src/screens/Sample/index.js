import { Appearance, Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../../components/styles'
import { AirbnbRating } from '@rneui/themed';
import WebView from 'react-native-webview';
import { useIsFocused } from '@react-navigation/native';
import { API_KEY, BASE_URL, WEBVIEW_URL } from '../../Config/key';
import { LocationContext, ProfileContext } from '../../context';
import { Images } from '../../assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components';

export const Sample = ({ route }) => {
    const data = route?.params?.data
    const { mapState } = LocationContext()
    const { currentUser } = ProfileContext()
    const { getColorScheme } = Appearance
    const mode = getColorScheme()
    const isFocused = useIsFocused()
    const [status, setStatus] = useState(false)
    const [webViewState, setWebViewState] = useState({
        loaded: false,
        actioned: false,
    });
    const webViewRef = useRef();
    function webViewLoaded() {
        setWebViewState({
            ...webViewState,
            loaded: true
        });
    }

    const postRating = async (rating) => {
        try {
            const response = await fetch('https://comp2140.uqcloud.net/api/samplerating/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: API_KEY,
                    sample_id: data.id,
                    rating: rating,
                }),
            });
            const jsonResponse = await response.json();
            console.log('resss:', jsonResponse)
            if (response.ok) {
                return jsonResponse;
            } else {
                const error = new Error(jsonResponse.message || 'Error posting rating');
                error.response = jsonResponse;
                throw error;
            }
        } catch (error) {

            console.error('Error in postRating:', error);
            throw error;
        }
    };

    useEffect(() => {
        const get = async () => {
            try {
                let res = await fetch(`${BASE_URL}/samplerating/?api_key=${API_KEY}&sample_id=${data.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                let data1 = await res.json()
                setStatus(Boolean(data1?.length) ? false : true)

            } catch (error) {
                console.log(error)
            }
        }
        get()
    }, [isFocused])

    function handleActionPress() {
        if (!webViewState.actioned) {
            webViewRef.current.injectJavaScript("playSong()");
        }
        else {
            webViewRef.current.injectJavaScript("stopSong()");
        }
        setWebViewState({
            ...webViewState,
            actioned: !webViewState.actioned
        });
    }

    const styles = {
        wrapper: {
            flex: 1,
            flexDirection: "column",
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colors[mode].bgColor
        },
        web: {
            height: 0
        },
        nameText: {
            fontSize: 20,
            fontWeight: "bold",
            color: colors[mode].fgColor,
            paddingBottom: 0
        },
        musicButton: {
            marginVertical: 22,
            backgroundColor: colors[mode].fgColor,
            color: colors[mode].bgColor,
            fontWeight: "bold",
            padding: 10,
            borderRadius: 10,
            textAlign: "center",
        },
        footer: {
            position: 'absolute',
            bottom: 75,
            left: '5%'
        },
        footerHeader: {
            fontSize: 20,
            marginBottom: 16,
            fontWeight: "bold",
            color: colors[mode].fgColor,
            paddingBottom: 0
        },
        imageWrapper: {
            height: 75, width: 75,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 75,
            backgroundColor: colors[mode].fgColor,
        },
        image: {
            height: 70,
            width: 70,
            borderRadius: 100
        },
        name: {
            fontSize: 16,
            color: colors[mode].fgColor,
            paddingStart: 16
        },
        bottomView: {
            marginTop: 10,
            height: 75, width: 75,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 75,
            backgroundColor: colors[mode].fgColor,
        },
        otherText: {
            fontSize: 16,
            color: colors[mode].fgColor,
            paddingStart: 16,
            marginBottom: -10,
        },
        icon: {
            height: 60,
            width: 60
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center'
        },
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <Header title={mapState?.nearbyLocation?.name} />
            <View style={styles.web}>
                <WebView
                    ref={ref => webViewRef.current = ref}
                    originWhitelist={["*"]}
                    pullToRefreshEnabled={true}
                    source={{
                        uri: 'https://comp2140.uqcloud.net/static/samples/index.html'
                    }}
                    onLoad={webViewLoaded}
                />
            </View>
            <View style={{ marginTop: 14 }}>
                <Text style={styles.nameText}>{data?.name}</Text>
                <TouchableOpacity onPress={handleActionPress}>
                    <Text style={styles.musicButton}>{!webViewState.actioned ? "Play Music" : "Stop Music"}</Text>
                </TouchableOpacity>
                <AirbnbRating
                    isDisabled={!status}
                    onFinishRating={(i) => postRating(i)}
                    count={5}
                    defaultRating={data?.rating}
                    size={35}
                    showRating={false}
                />
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerHeader}>Currently At This Location</Text>
                <View style={styles.row}>
                    <View style={styles.imageWrapper}>
                        {currentUser?.image && <Image
                            style={styles.image}
                            source={{ uri: currentUser?.image?.uri }} />}
                    </View>
                    <Text style={styles.name}>{currentUser?.name ?? 'Cat'}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.bottomView}>
                        <Image
                            style={styles.icon}
                            source={Images.smiley_white} />
                    </View>
                    <Text style={styles.otherText}>Add Others...</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Sample
