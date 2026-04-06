import React from "react";
import { Alert, Text, View, StyleSheet, Pressable } from "react-native";

interface WorkoutViewProps {
    title: string;
    description: string;
    reps: number;
    machine: string;
    onPress: () => void;
}

export default function WorkoutView({ title, description, reps, machine, onPress }: WorkoutViewProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.reps}>Reps: {reps}</Text>
            <Text style={styles.machine}>Machine: {machine}</Text>
            <Pressable onPress={onPress} style={styles.button}>
                <Text style={styles.buttonText}>See Workout</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#06b690",
        borderRadius: 10,
        borderColor: "#09eba3",
        borderWidth: 2,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 300,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    reps: {
        fontSize: 16,
        marginBottom: 10,
    },
    machine: {
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#09eba3',
        borderRadius: 15,
        backgroundColor: '#09eba3',
        marginTop: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#055c49',
        fontWeight: 'bold',
    },
});