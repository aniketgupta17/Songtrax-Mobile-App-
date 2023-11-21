import { useEffect, useState } from 'react';
import { Image, PermissionsAndroid, Platform, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../components/styles';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import { useLocation } from '../hooks/useLocation';
import { Route } from '../constants/Routs';
import { API_KEY, BASE_URL } from '../Config/key';
import { Images } from '../assets';
import { EditProfile, Maps } from '../screens';
import NearStack from './stack';
import { LocationContext } from '../context';

const { Navigator, Screen } = createBottomTabNavigator();

export function MyApp() {
    const { requestLocationPermission } = useLocation()
    const { mapState, setMapState } = LocationContext()
    const [locationsData, setLocations] = useState([])

    useEffect(() => {
        const Fetch = async () => {
            try {
                let res = await fetch(`${BASE_URL}/location/?api_key=${API_KEY}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                let loc = await requestLocationPermission()

                let isLocation = loc === 'granted' ? true : false
                let data = await res.json()
                let tem = data.filter((loc) => { return loc.latitude != null || loc.longitude != null })
                setLocations(tem)
                tem && setMapState({ ...mapState, locations: tem, locationPermission: isLocation ? true : false })
            } catch (error) {
                console.log(error)
            }
        }
        Fetch()
    }, [])

    const requestLocPermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                try {
                    const status = Geolocation.requestAuthorization('whenInUse');
                    if (status === 'granted') {
                        setMapState({ ...mapState, locationPermission: true })
                    } else if (status === 'denied') {
                        setMapState({ ...mapState, locationPermission: false })
                    }
                } catch (error) {
                    console.log('error')
                }
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'ALLTRUEistic app needs access to your location',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setMapState({ ...mapState, locationPermission: true })
                } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                    setMapState({ ...mapState, locationPermission: false })

                }
            }
        } catch (err) {
            console.log('eerr', err)
        }

    }

    useEffect(() => {
        if (mapState?.locationPermission) {
            const subscription = Geolocation.watchPosition(
                position => {
                    const userLocation = {
                        latitude: position.coords.latitude, longitude: position.coords.longitude
                    }
                    const nearbyLocation = calculateDistance(userLocation);
                    setMapState({
                        ...mapState,
                        userLocation,
                        nearbyLocation: nearbyLocation
                    })
                },
                error => console.log(error), { enableHighAccuracy: true }
            )
            return () => {
                if (subscription) {
                    subscription?.remove();
                }
            };
        }
    }, [mapState?.locations]);


    let loc = { "latitude": 33.7487293919571840, "longitude": -0.3876829929649800, }
    function calculateDistance(userLocation) {
        const nearestLocations = locationsData?.map(location => {
            let coordinates = { longitude: location.longitude, latitude: location.latitude }
            const metres = getDistance(
                // userLocation,
                loc,
                coordinates
            );
            location["distance"] = {
                metres: metres,
                nearby: metres <= 100 ? true : false
            };
            return location;
        }).sort((previousLocation, thisLocation) => {
            return previousLocation.distance.metres - thisLocation.distance.metres;
        });
        return nearestLocations?.shift();
    }

    return (
        <NavigationContainer>
            <Navigator
                tabBar={props => <MyTabBar props={props} />}
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarHideOnKeyboard: true,
                }}>
                <Screen name={Route.MAPS} component={Maps} />
                <Screen name={Route.NEAR_SAMPLES_STACK} component={NearStack} />
                <Screen name={Route.EDIT_PROFILE} component={EditProfile} />
            </Navigator>
        </NavigationContainer>
    );
}


const styles = {
    wrapper: {
        backgroundColor: 'transparent',
        borderTopColor: '#e9e9e9',
        bottom: 0, right: 0, left: 0,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 60,
        paddingHorizontal: 26
    },
    icon: { height: 30, width: 30 },
    image: { height: 24, width: 150 },
    center: { alignItems: 'center', justifyContent: 'center' }

}
function MyTabBar({ props }) {
    const { state, descriptors, navigation } = props
    const { mapState, } = LocationContext()
    return (
        <View style={styles.wrapper}>
            <LinearGradient colors={[colors.purpleColorLighter, colors.blueColorDarker]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            activeOpacity={.7}
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{ flex: index == 1 ? 5 : 1, alignItems: 'center' }}
                        >
                            <View style={{ alignItems: 'center', opacity: isFocused ? 1 : index == 1 ? 1 : .4, justifyContent: 'center', backgroundColor: isFocused ? '#00000090' : 'transparent', width: index == 1 ? 200 : 60, height: '100%' }}>
                                {index == 0 && <Image style={styles.icon} source={Images.map_white} />}
                                {index == 1 &&
                                    <View style={styles.center}>
                                        <Image style={styles.image} resizeMode='contain'
                                            source={Images.logo_white} />
                                        {mapState?.nearbyLocation?.distance?.nearby && <Text style={{ color: 'white' }}>There is music Nearby</Text>}
                                    </View>
                                }
                                {index == 2 && <Image style={styles.icon} source={Images.profile_white} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </LinearGradient>
        </View>
    );
}