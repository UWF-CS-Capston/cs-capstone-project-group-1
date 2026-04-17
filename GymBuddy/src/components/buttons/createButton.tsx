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
        borderWidth: 3,
        borderColor: '#009e6c',
        borderRadius: 5,
        backgroundColor: '#ffffff',
        margin: 5,
    },
    buttonText: {
        color: '#055c49',
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: 5,
    }
});