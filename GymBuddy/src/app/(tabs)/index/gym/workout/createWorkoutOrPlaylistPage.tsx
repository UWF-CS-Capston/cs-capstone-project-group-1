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
import { MultipleSelectList } from "react-native-dropdown-select-list";

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
    const [sets, setSets] = React.useState(0);
    const [weight, setWeight] = React.useState(0);
    const [workouts, setWorkouts] = React.useState<Workout[]>([]);
    const [playlists, setPlaylists] = React.useState<WorkoutPlaylist[]>([]);
    const [duration, setDuration] = React.useState(0);
    const [machine, setMachine] = React.useState("");
    const [selectedWorkouts, setSelectedWorkouts] = React.useState<Workout[]>([]);

    React.useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await apiFetch('/workouts');
                if (response.ok) {
                    const data = await response.json();
                    setWorkouts(data.workouts);
                }
                else {
                    console.error('Failed to fetch workouts');
                }
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        };
    }, []);
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
                    sets: 0, // Placeholder, replace with actual value
                    weight: 0, // Placeholder, replace with actual value
                    duration: 0, // Placeholder, replace with actual value
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
                <NavButton title="Create Workout" onPress={handleCreateWorkout} />
                <NavButton title="Create Playlist" onPress={handleCreatePlaylist} />
            </View>
            {createWorkout && (
                <CreateWorkoutView>
                    <Text style={styles.header}>Create Workout</Text>

                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldTitle}>Workout Name</Text>
                        <FormField placeholder="Name" value={workoutName} onChange={setWorkoutName} />
                    </View>

                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldTitle}>Description</Text>
                        <FormField placeholder="Description" value={description} onChange={setDescription} />
                    </View>

                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldTitle}>Reps</Text>
                        <NumberField placeholder="Reps" value={String(reps)} onChange={(value) => {
                            try {
                                const numericValue = Number(value);
                                if (!isNaN(numericValue)) {
                                    setReps(numericValue);
                                } else {
                                    console.warn('Invalid number input:', value);
                                }
                            } catch (error) {
                                console.error('Error parsing number input:', error);
                            }
                            } }
                            />
                    </View>

                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldTitle}>Machine</Text>
                        <FormField placeholder="Machine" value={machine} onChange={setMachine} />
                    </View>
                    
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldTitle}>Sets</Text>
                        <NumberField placeholder="Sets" value={String(sets)} onChange={(value) => {
                            try {
                                const numericValue = Number(value);
                                if (!isNaN(numericValue)) {
                                    setSets(numericValue);
                                } else {
                                    console.warn('Invalid number input:', value);
                                }
                            } catch (error) {
                                console.error('Error parsing number input:', error);
                            }
                        }} />
                    </View>

                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldTitle}>Weight</Text>
                        <NumberField placeholder="Weight" value={String(weight)} onChange={(value) => {
                            try {
                                const numericValue = Number(value);
                                if (!isNaN(numericValue)) {
                                    setWeight(numericValue);
                                } else {
                                    console.warn('Invalid number input:', value);
                                }                            
                            } catch (error) {
                                console.error('Error parsing number input:', error);
                            }
                        }} />
                    </View>

                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldTitle}>Duration (seconds)</Text>
                        <NumberField placeholder="Duration" value={String(duration)} onChange={(value) => {
                            try {
                                const numericValue = Number(value);
                                if (!isNaN(numericValue)) {
                                    setDuration(numericValue);
                                } else {
                                    console.warn('Invalid number input:', value);
                                }
                            } catch (error) {
                                console.error('Error parsing number input:', error);
                            }
                        }} />
                    </View>

                    <View style={styles.fieldRow}>
                        <NavButton title="Back" onPress={() => router.back()} />
                        <FormButton title="Create" onPress={() => {
                            createWorkoutButton();
                        }} />
                    </View>
                </CreateWorkoutView>
            )}

            {createPlaylist && (
                <CreateWorkoutView>
                    <Text style={styles.header}>Create Playlist</Text>

                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldTitle}>Playlist Name</Text>
                        <FormField placeholder="Name" value={playlistName} onChange={setPlaylistName} />
                    </View>

                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldTitle}>Workouts</Text>
                        <MultipleSelectList 
                            checkBoxStyles={
                                {
                                    width: 20,
                                    height: 20,
                                    borderColor: '#09eba3',
                                    borderRadius: 5,
                                    backgroundColor: '#09eba3',
                                }
                            }
                            boxStyles={
                                {
                                    width: 200,
                                    marginTop: 5,
                                    marginBottom: 10,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    backgroundColor: '#09eba3',
                                    borderColor: '#09eba3',
                                    borderRadius: 15,
                                    padding: 15,
                                }
                            }
                            inputStyles={
                                {
                                    color: '#055c49'
                                }
                            }
                            dropdownStyles={
                                {
                                    width: 200,
                                    backgroundColor: '#09eba3',
                                    borderColor: '#09eba3',
                                    borderRadius: 15,
                                    marginLeft: 10,
                                    marginTop: 5,
                                    marginRight: 10,
                                }
                            }
                            data={workouts.map(workout => ({ key: workout.id, value: workout.title }))}
                            setSelected={(selectedWorkouts: Workout[]) => setSelectedWorkouts(selectedWorkouts)}
                            save="value"
                        />
                    </View>


                    <View style={styles.fieldRow}>
                        <NavButton title="Back" onPress={() => router.back()} />
                        <FormButton title="Create" onPress={() => createPlaylistButton()} />
                    </View>
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
        marginRight: 10,
    },
    fieldTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    fieldRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    }
});