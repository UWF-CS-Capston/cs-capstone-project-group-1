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
        borderWidth: 1,
        borderColor: '#09eba3',
        borderRadius: 15,
        backgroundColor: '#09eba3',
        marginRight: 5,
        marginLeft: 5,
    },
    buttonText: {
        color: '#055c49',
        textAlign: 'center',
        fontWeight: 'bold',
    }
})