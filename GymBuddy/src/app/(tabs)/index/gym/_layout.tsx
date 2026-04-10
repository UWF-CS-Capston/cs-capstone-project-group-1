import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function RootLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarPosition: 'top',
            tabBarStyle: { backgroundColor: '#0eb18d' },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#fff',
            tabBarLabelStyle: { fontSize: 24 },
        }}>
            <Tabs.Screen name="machinePage" options={{
                title: "Machines",
                tabBarIcon: ({focused, color, size}) => (
                    <Ionicons name={focused ? 'barbell-sharp' : 'barbell-outline'} size={size} color={color} />
                ),
                }} />
            
            <Tabs.Screen name="workout" options={{
                title: "Workouts",
                tabBarIcon: ({focused, color, size}) => (
                    <Ionicons name={focused ? 'fitness-sharp' : 'fitness-outline'} size={size} color={color} />
                ),
                }} />
        </Tabs>
    );
}