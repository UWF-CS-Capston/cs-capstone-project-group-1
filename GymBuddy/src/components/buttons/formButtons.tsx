import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';

interface FormButtonProps {
    title: string;
    onPress?: () => void;
}

export default function FormButton({ title, onPress }: FormButtonProps) {
    return (
        <Pressable onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 100,
        padding: 10,
        borderWidth: 3,
        borderColor: '#009e6c',
        borderRadius: 5,
        backgroundColor: '#ffffff',
        marginLeft: 10,
        marginTop: 5,
    },
    buttonText: {
        color: '#006d4b',
        textAlign: 'center',
        fontWeight: 'bold',
    }
})