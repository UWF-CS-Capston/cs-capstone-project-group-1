import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        color: '#053a2e',
    },
});

export default function HeaderTwoText({ children }: { children: React.ReactNode }) {
    return (
        <Text style={styles.header}>
            {children}
        </Text>
    );
};

