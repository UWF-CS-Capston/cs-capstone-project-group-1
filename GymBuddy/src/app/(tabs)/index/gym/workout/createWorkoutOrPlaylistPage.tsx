import React from "react";
import { Alert, Text, View, StyleSheet} from "react-native";
import MainView from "../../../../../components/views/mainView";
import NavButton from "../../../../../components/buttons/navButton";
import FormButton from "../../../../../components/buttons/formButtons";
import FormField from "../../../../../components/inputFields/inputField";
import { router } from "expo-router";
import storage from "../../../../../utils/storage";
import { apiFetch } from "../../../../../utils/api";
import WorkoutView from "../../../../../components/views/workoutView";
import CreateWorkoutView from "../../../../../components/views/createWorkoutView";
import NumberField from "../../../../../components/inputFields/numberField";

type Workout = {
    id: string;
    title: string;
    description: string;
    reps: number;
    machine:string;
};

type WorkoutPlaylist = {
    id: string;
    title: string;
    description: string;
    workouts: Workout[];
};

export default function CreateWorkoutOrPlaylistPage() {
    const [createWorkout, setCreateWorkout] = React.useState(true);
    const [createPlaylist, setCreatePlaylist] = React.useState(false);
    const [workoutName, setWorkoutName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [playlistName, setPlaylistName] = React.useState("");
    const [playlistDescription, setPlaylistDescription] = React.useState("");
    const [reps, setReps] = React.useState(0);
    const [machine, setMachine] = React.useState("");

    const getToken = async () => {
        try {
            const token = await storage.getItem('token');
            return token;
        }
        catch (error) {
            console.error('Error retrieving token:', error);
        }
    };

    const getUserId = async () => {
        try {
            const userId = await storage.getItem('userId');
            return userId;
        } catch (error) {
            console.error('Error retrieving user ID:', error);
        }
    };

    const getUserRole = async () => {
        try {
            const userRole = await storage.getItem('userRole');
            return userRole;
        } catch (error) {
            console.error('Error retrieving user role:', error);
        }
    };

    const handleCreateWorkout = () => {
        setCreateWorkout(true);
        setCreatePlaylist(false);
    };

    const handleCreatePlaylist = () => {
        setCreateWorkout(false);
        setCreatePlaylist(true);
    };

    const createWorkoutButton = async () => {
        const token = await getToken();
        const userId = await getUserId();
        const userRole = await getUserRole();
        
        try {
            const res = await apiFetch('/workouts', {
                method: 'POST',
                body: JSON.stringify({
                    title: workoutName,
                    description,
                    reps: 0, // Placeholder, replace with actual value
                    machine: '', // Placeholder, replace with actual value
                    userId,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                Alert.alert('Workout created successfully!');
                router.push('/(tabs)/index/gym/workout');
            } else {
                Alert.alert('Failed to create workout:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error creating workout:', error);

        }
    }

    const createPlaylistButton = async () => {
        const token = await getToken();
        const userId = await getUserId();
        const userRole = await getUserRole();

        try {
            const res = await apiFetch('/playlists', {
                method: 'POST',
                body: JSON.stringify({
                    title: playlistName,
                    description: playlistDescription,
                    workouts: [], // Placeholder, replace with actual value
                    userId,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                Alert.alert('Playlist created successfully!');
                router.push('/(tabs)/index/gym/workout');
            } else {
                Alert.alert('Failed to create playlist:', data.message || 'Unknown error');
            }
        }
        catch (error) {
            console.error('Error creating playlist:', error);
        }
    }

    return (
        <MainView>
            <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'center' }}>
                <FormButton title="Create Workout" onPress={handleCreateWorkout} />
                <FormButton title="Create Playlist" onPress={handleCreatePlaylist} />
            </View>
            {createWorkout && (
                <CreateWorkoutView>
                    <Text style={styles.header}>Create Workout</Text>
                    <FormField placeholder="Workout Name" value={workoutName} onChange={setWorkoutName} />
                    <FormField placeholder="Description" value={description} onChange={setDescription} />
                    <NumberField placeholder="Reps" value={String(reps)} onChange={(value) => setReps(Number(value))} />
                    <FormField placeholder="Machine" value={machine} onChange={setMachine} />
                    {/* Add more fields as needed */}
                    <FormButton title="Save Workout" onPress={() => {
                        
                    }} />
                </CreateWorkoutView>
            )}
            {createPlaylist && (
                <CreateWorkoutView>
                    <Text style={styles.header}>Create Playlist</Text>
                    <FormField placeholder="Playlist Name" value={playlistName} onChange={setPlaylistName} />
                    <FormField placeholder="Description" value={playlistDescription} onChange={setPlaylistDescription} />
                    <FormButton title="Save Playlist" onPress={() => Alert.alert('Playlist saved!')} />
                </CreateWorkoutView>
            )}
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