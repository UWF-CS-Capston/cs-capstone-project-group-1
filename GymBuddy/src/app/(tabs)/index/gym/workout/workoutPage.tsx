import React from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import MainView from "../../../../../components/views/mainView";
import WorkoutView from "../../../../../components/views/workoutView";
import NavButton from "../../../../../components/buttons/navButton";
import CreateButton from "../../../../../components/buttons/createButton";
import { router } from "expo-router";
import { apiFetch } from "../../../../../utils/api";
import WorkoutPlaylistView from "../../../../../components/views/workoutPlaylistView";
import storage from "../../../../../utils/storage";

const mockWorkoutData = {
    title: "Bench Press",
    description: "A fundamental upper body exercise that targets the chest, shoulders, and triceps.",
    reps: 5,
    machine: "Bench Press Machine",
};

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


export default function WorkoutPage() {
    const [workouts, setWorkouts] = React.useState<Workout[]>([]);
    const [playlists, setPlaylists] = React.useState<WorkoutPlaylist[]>([]);

    React.useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await apiFetch('/workouts');
                if (response.ok) {
                    const data = await response.json();
                    setWorkouts(data.workouts);
                } else {
                    console.error('Failed to fetch workouts');
                }
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        };
        const fetchPlaylists = async () => {
            try {
                const response = await apiFetch('/playlists');
                if (response.ok) {
                    const data = await response.json();
                    setPlaylists(data.playlists);
                } else {
                    console.error('Failed to fetch playlists');
                }
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };
        fetchWorkouts();
        fetchPlaylists();
    }, []);

    const getToken = async () => {
        try {            
            const token = await storage.getItem('token');
            console.log('Retrieved token:', token);
            return token;
        } catch (error) {
            console.error('Error retrieving token:', error);
        }
    };

    const handleCreateWorkoutOrPlaylist = () => {
        router.push('/gym/workout/createWorkoutOrPlaylistPage');
     };
    
    return (
        <MainView>
            <CreateButton title="Create Workout or Playlist" onPress={
                handleCreateWorkoutOrPlaylist
            } />
            <Text style={styles.header}>
                Workouts:
            </Text>
                {workouts.map((workout) => (
                    <WorkoutView
                        key={workout.id}
                        title={workout.title}
                        description={workout.description}
                        reps={workout.reps}
                        machine={workout.machine}
                        onPress={() => Alert.alert(`Viewing workout: ${workout.title}`)}
                    />
                ))}
            <Text style={styles.header}>
                Playlists:
            </Text>
            {playlists.map((playlist) => (
                <WorkoutPlaylistView
                    key={playlist.id}
                    title={playlist.title}
                    description={playlist.description}
                    workouts={playlist.workouts}
                    onPress={() => Alert.alert(`Viewing playlist: ${playlist.title}`)}
                />
            ))}
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