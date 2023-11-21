import { Appearance, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react'
import { AirbnbRating } from '@rneui/themed';
import { useIsFocused } from '@react-navigation/native';
import { Header, colors } from '../../components';
import { API_KEY, BASE_URL } from '../../Config/key';
import { LocationContext } from '../../context';
import { Route } from '../../constants/Routs';

export const NearSamples = ({ navigation }) => {
    const { getColorScheme } = Appearance
    const { mapState } = LocationContext()
    const theme = getColorScheme()
    const [data, setData] = useState([])
    const isFocused = useIsFocused()
    const [Near, setNearBy] = useState(mapState?.nearbyLocation)

    useEffect(() => {
        let near = mapState?.nearbyLocation?.distance?.nearby
        if (near) {
            Fetch()
        }
    }, [isFocused, mapState?.nearbyLocation])


    const Rattings = async (uid) => {
        try {
            let reply = await fetch(`${BASE_URL}/samplerating/?api_key=${API_KEY}&sample_id=${uid}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
            let response = await reply.json()
            const sumOfRatings = response.reduce((acc, review) => acc + review.rating, 0);
            return response.length > 0 ? parseFloat((sumOfRatings / response.length).toFixed(1)) : 0;
        } catch (error) {
            console.log(error)
        }
    }

    const Fetch = async () => {
        try {
            let res = await fetch(`${BASE_URL}/sample/?api_key=${API_KEY}&location_id=${Near.id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            let data = await res.json()
            const promises = data.map(d => Rattings(d.id).then(rating => ({ ...d, rating })));
            Promise.all(promises).then(newData => {
                setData(newData)
            }).catch(error => {
                console.error('Error', error);
            });
            return await res.json();
        } catch (error) {
            console.log(error)
        }
    }


    const styles = {
        container: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colors[theme].bgColor
        },
        text: {
            fontSize: 14,
            color: colors[theme].textColor,
            paddingBottom: 0
        },
        line: {
            height: 1, width: '100%',
            marginTop: 16,
            marginBottom: 8,
            backgroundColor: colors[theme].textColor
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title={mapState?.nearbyLocation?.distance?.nearby ? mapState?.nearbyLocation?.name : 'No Nearby Location'} />
            <View style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    renderItem={({ item, index }) => {
                        const getDay = new Date(item.datetime).getDay()
                        const getDate = new Date(item.datetime).getDate()
                        const getFullYear = new Date(item.datetime).getFullYear()

                        return (
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() => navigation.navigate(Route.SAMPLE, { data: item })}
                            >
                                <Text style={styles.text}>{item?.name}</Text>
                                <Text style={styles.text}>{`${getDay}-${getDate}-${getFullYear}`}</Text>
                                <AirbnbRating
                                    isDisabled
                                    count={5}
                                    defaultRating={item?.rating}
                                    size={20}
                                    showRating={false}
                                />
                                <View style={styles.line} />
                            </TouchableOpacity>
                        )
                    }}
                    ItemSeparatorComponent={<View style={{ height: 10 }} />}
                />
            </View>
        </SafeAreaView>
    )
}

export default NearSamples