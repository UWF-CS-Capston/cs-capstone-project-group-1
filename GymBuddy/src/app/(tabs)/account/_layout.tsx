import { Stack, Tabs } from "expo-router";

const isAuthenticated: boolean = true; // Placeholder for authentication state
export default function AccountLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="index" options={{ title: "Account" }} />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
            <Stack.Screen name="loginForm" options={{ title: "Login" }} />
            <Stack.Screen name="createForm" options={{ title: "Create Account" }} />
        </Stack> 
    );
}   