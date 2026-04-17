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
        alignItems: 'flex-start',
        backgroundColor: '#f7f6f6',
        margin: 20,
        padding: 20,
    },

})