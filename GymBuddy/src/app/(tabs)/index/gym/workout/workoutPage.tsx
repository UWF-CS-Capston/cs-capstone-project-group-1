import React from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import MainView from "../../../../../components/views/mainView";
import WorkoutView from "../../../../../components/views/workoutView";
import NavButton from "../../../../../components/buttons/navButton";
import CreateButton from "../../../../../components/buttons/createButton";
import { router } from "expo-router";
import { apiFetch } from "../../../../../utils/api";
import WorkoutPlaylistView from "../../../../../components/views/workoutPlaylistView";

const mockWorkoutData = {
    title: "Bench Press",
    description: "A fundamental upper body exercise that targets the chest, shoulders, and triceps.",
    reps: 5,
    machine: "Bench Press Machine",
};


export default function WorkoutPage() {
    
    return (
        <MainView>
            <Text style={styles.header}>
                Workouts:
            </Text>
            <WorkoutView 
                title={mockWorkoutData.title}
                description={mockWorkoutData.description}
                reps={mockWorkoutData.reps}
                machine={mockWorkoutData.machine}
                onPress={() => Alert.alert("Performing workout...")}
            />
            <CreateButton 
                title="Create Workout" 
                onPress={() => {
                    router.push('/workout/createWorkoutPage')
                }}
            />
            <Text style={styles.header}>
                Playlists:
            </Text>
            <WorkoutPlaylistView
                title="Strength Training"
                description="A playlist focused on building strength with compound movements."
                workouts={["Squats", "Deadlifts", "Bench Press"]}
                onPress={() => Alert.alert("Viewing playlist...")}
            />
            <CreateButton 
                title="Create Playlist" 
                onPress={() => {
                    router.push('/createPlaylist')
                }}
            />
            <NavButton title="Return Gym Page" onPress={ () => {
                router.dismiss()
            }} />
        </MainView>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
});