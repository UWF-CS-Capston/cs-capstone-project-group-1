import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

export default function NavButton({ to, title }: { to: string; title: string }) {
    const router = useRouter();
    return (
        <View style={styles.button}>
            <Pressable onPress={() => router.replace(to)}>
                <Text style={styles.buttonText}>{title}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 200,
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