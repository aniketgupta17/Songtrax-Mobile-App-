import { PermissionsAndroid, Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

export const useLocation = () => {

    const requestLocationPermission = async () => {
        let status = false
        try {
            if (Platform.OS === 'ios') {
                try {
                    return await Geolocation.requestAuthorization('whenInUse');
                } catch (error) {
                    console.log(error);
                }
            }
            else {
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
                    return 'granted'
                } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                    return 'denied'

                }
            }
            // return status
        } catch (err) {
            console.log(err);
            return false
        }
    };

    return { requestLocationPermission }
} 