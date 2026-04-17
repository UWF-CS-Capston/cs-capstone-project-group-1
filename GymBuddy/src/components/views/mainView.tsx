import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function MainView({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#f7f6f6',
        paddingTop: 50,
    },
})