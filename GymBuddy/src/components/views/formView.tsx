import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function FormView({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        backgroundColor: '#06d3a7',
        margin: 20,
        borderColor: '#09eba3',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
    },
})