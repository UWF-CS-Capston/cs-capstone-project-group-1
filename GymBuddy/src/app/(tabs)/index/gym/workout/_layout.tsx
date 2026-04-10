import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="workoutPage" options={{title: "Workouts"}} />
            <Stack.Screen name="createWorkoutOrPlaylistPage" options={{title: "Create Workout or Playlist"}} />
        </Stack>
    );
}