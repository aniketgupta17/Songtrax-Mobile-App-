import { Appearance, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from './styles'

export const Button = ({ onPress, title }) => {
    const { getColorScheme } = Appearance
    const mode = getColorScheme()
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={{
                backgroundColor: colors[mode].fgColor,
                color: colors[mode].bgColor,
                fontWeight: "bold",
                padding: 10,
                borderRadius: 10,
                textAlign: "center",
                width: "50%",
                marginLeft: "25%",
                marginTop: -72
            }}>Change Photo</Text>
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({})