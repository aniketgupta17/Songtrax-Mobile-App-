import { Appearance, Image, Text, View } from 'react-native'
import React from 'react'
import { colors } from './styles'

export const Header = ({ title }) => {
    const { getColorScheme } = Appearance
    const theme = getColorScheme()
    return (
        <View style={{
            marginBottom: 24,
            flexDirection: 'row',
            marginHorizontal: 24,
            justifyContent: 'space-between', alignItems: 'center', marginVertical: 16
        }}>
            <Image
                resizeMode='contain'
                source={theme == 'dark' ? require('../assets/icon-pin-lightpurple.png') : require('../assets/icon-pin-darkpurple.png')}
                style={{ height: 50, width: 50 }}
            />
            <Text style={{
                fontSize: 26,
                fontWeight: "bold",
                color: colors[theme].fgColor,
            }}>{title ?? 'No Location Fond'}</Text>
        </View>
    )
}

export default Header