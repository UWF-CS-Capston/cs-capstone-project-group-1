import React from "react";
import { Alert, Text, View, StyleSheet } from "react-native";

type Workout = {
    id: string;
    title: string;
    description: string;
    reps: number;
    machine: string;
};

type WorkoutPlaylist = {
    id: string;
    title: string;
    description: string;
    workouts: Workout[];
};

export default function CreateWorkoutView({children}: {children: React.ReactNode}) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        backgroundColor: '#06b690',
        margin: 20,
        borderColor: '#09eba3',
        borderWidth: 2,
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 7 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})