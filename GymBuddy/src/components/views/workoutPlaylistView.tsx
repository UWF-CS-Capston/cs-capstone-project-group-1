import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

type Workout = {
    id: string;
    title: string;
    description: string;
    reps: number;
    machine: string;
};

interface WorkoutPlaylistViewProps {
    title: string;
    description: string;
    workouts: Workout[];
    onPress: () => void;
}

export default function WorkoutPlaylistView({ title, description, workouts, onPress }: WorkoutPlaylistViewProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.workouts}>Workouts: {workouts.join(", ")}</Text>
            <Pressable onPress={onPress} style={styles.button}>
                <Text style={styles.buttonText}>View Playlist</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderColor: "#009e6c",
        borderWidth: 3,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 300,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#055c49',
        borderBottomWidth: 1,
        borderBottomColor: '#009e6c',
        paddingBottom: 5,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    workouts: {
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        width: '50%',
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
        fontWeight: 'bold',
    },
});