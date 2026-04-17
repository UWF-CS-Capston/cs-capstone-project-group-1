import React from "react";
import { Alert, Modal, View, StyleSheet } from "react-native";
import MainView from "../../../../../components/views/mainView";
import WorkoutView from "../../../../../components/views/workoutView";
import NavButton from "../../../../../components/buttons/navButton";
import CreateButton from "../../../../../components/buttons/createButton";
import { router } from "expo-router";
import { apiFetch } from "../../../../../utils/api";
import WorkoutPlaylistView from "../../../../../components/views/workoutPlaylistView";
import storage from "../../../../../utils/storage";
import HeaderText from "../../../../../components/texts/headerText";
import HeaderTwoText from "../../../../../components/texts/headerTwoText";
import { set } from "supertest/lib/cookies";

const mockWorkoutData = {
    id: "1",
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
    const [detailsVisible, setDetailsVisible] = React.useState(false);
    const [selectedWorkout, setSelectedWorkout] = React.useState<Workout | null>(null);

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

    const loadWorkoutDetails = async (workoutId: string) => {
        try {
            const token = await getToken();
            const response = await apiFetch(`/workouts/${workoutId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedWorkout(data.workout);
                setDetailsVisible(true);
            } else {
                console.error('Failed to fetch workout details');
            }
        } catch (error) {
            console.error('Error fetching workout details:', error);
            setDetailsVisible(false);
            setSelectedWorkout(null);
        }
    };

    const handleCreateWorkoutOrPlaylist = () => {
        router.push('/gym/workout/createWorkoutOrPlaylistPage');
     };
    
    return (
        <MainView>
            <HeaderText>Workouts and Playlists</HeaderText>

            <View style={{ marginBottom: 10, marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <CreateButton title="Create Workout or Playlist" onPress={
                    handleCreateWorkoutOrPlaylist
                } />
            </View>
            <HeaderTwoText>
                Workouts:
            </HeaderTwoText>
                {workouts.map((workout) => (
                    <WorkoutView
                        key={workout.id}
                        title={workout.title}
                        description={workout.description}
                        reps={workout.reps}
                        machine={workout.machine}
                        onPress={() => void loadWorkoutDetails(workout.id)}
                    />
                ))}
            <HeaderTwoText>
                Playlists:
            </HeaderTwoText>
            {playlists.map((playlist) => (
                <WorkoutPlaylistView
                    key={playlist.id}
                    title={playlist.title}
                    description={playlist.description}
                    workouts={playlist.workouts}
                    onPress={() => Alert.alert(`Viewing playlist: ${playlist.title}`)}
                />
            ))}
            <View style={{ marginTop: 20, marginLeft: 20 }}>
                <NavButton title="Return Gym Page" onPress={ () => {
                    router.dismiss()
                }} />
            </View>

            <Modal 
            visible={false} 
            animationType="slide" 
            transparent={true}
            onRequestClose={() => {
                setDetailsVisible(false)
                setSelectedWorkout(null)
            }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <View style={{ width: 300, padding: 20, backgroundColor: "#fff", borderRadius: 10 }}>
                        <HeaderText>Workout Details</HeaderText>
                        <WorkoutView
                            title={mockWorkoutData.title}
                            description={mockWorkoutData.description}
                            reps={mockWorkoutData.reps}
                            machine={mockWorkoutData.machine}
                            onPress={() => Alert.alert(`Viewing workout: ${mockWorkoutData.title}`)}
                        />
                        <NavButton title="Close" onPress={() => {
                            setDetailsVisible(false)
                            setSelectedWorkout(null)
                        }} />
                    </View>
                </View>
            </Modal>

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