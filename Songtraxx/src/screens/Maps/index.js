import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Appearance, Dimensions } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LocationContext } from '../../context';
import Geolocation from 'react-native-geolocation-service';
const initialRegion = { latitude: 33.748729391957184, longitude: -0.38768299296498, latitudeDelta: 0.0922, longitudeDelta: 0.0421, };


export const Maps = () => {
  const mapRef = useRef(null);
  const { getColorScheme } = Appearance
  let mode = getColorScheme()
  const [radius, setRadius] = useState(200);
  const { mapState } = LocationContext()

  const onRegionChange = (r) => {
    // console.log('first', r)
    const zoom = initialRegion.latitudeDelta / r.latitudeDelta;
    const Nradius = 200 / zoom;
    setRadius(Nradius);
  };

  const styles = {
    wrapper: {
      flex: 1,
      width: '100%', height: '100%',
    },
  }


  useEffect(() => {
    getCurrentLocation()
  }, [])
  const getCurrentLocation = () => {
    Geolocation?.getCurrentPosition(
      (position) => {
        animateToUserLocation(position?.coords?.latitude, position?.coords?.longitude);
      }, (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const animateToUserLocation = (lat, long) => {
    if (lat && long) {
      const region = {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      mapRef.current.animateToRegion(region);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        zoomEnabled
        showsUserLocation
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={onRegionChange}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {mapState?.locations && mapState?.locations?.map((item, index) => {
          return (
            <Circle
              center={{
                latitude: 37.78825,
                longitude: -122.4124,
                // latitude: parseFloat(item?.latitude),
                // longitude: parseFloat(item?.longitude)
              }}
              key={index}
              strokeWidth={3}
              radius={radius}
              fillColor={mode == 'dark' ? "rgba(128,0,128,0.5)" : "rgba(210,169,210,0.5)"}
              strokeColor="#A42DE8"
            />
          )
        })
        }
      </MapView>
    </SafeAreaView>
  )
}

export default Maps

