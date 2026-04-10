import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface CreateButtonProps {
    title: string;
    onPress?: () => void;
}

export default function CreateButton({ title, onPress }: CreateButtonProps) {
    return (
        <Pressable onPress={onPress} style={styles.button}>
            <Ionicons name="add" size={20} color="#055c49" />
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#09eba3',
        borderRadius: 15,
        backgroundColor: '#09eba3',
        margin: 5,
    },
    buttonText: {
        color: '#055c49',
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: 5,
    }
});