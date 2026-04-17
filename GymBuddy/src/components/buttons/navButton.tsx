import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

interface NavButtonProps {
    title: string;
    onPress?: () => void;
}

export default function NavButton({ title, onPress }: NavButtonProps) {
  const router = useRouter();
    return (
    <View style={styles.button}>
        <Pressable onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 200,
        padding: 10,
        borderWidth: 3,
        borderColor: '#009e6c',
        borderRadius: 5,
        backgroundColor: '#ffffff',
        marginLeft: 10,
        marginTop: 5,
    },
    buttonText: {
        color: '#055c49',
        textAlign: 'center',
        fontWeight: 'bold',
    }
})