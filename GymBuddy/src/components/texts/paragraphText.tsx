import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    paragraph: {
        fontSize: 24,
        lineHeight: 24,
        marginBottom: 15,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
    },
});

export default function ParagraphText({ children }: { children: React.ReactNode }) {
    return (
        <Text style={styles.paragraph}>
            {children}
        </Text>
    );
}
