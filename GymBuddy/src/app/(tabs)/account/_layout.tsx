import { Stack } from "expo-router";

export default function AccountLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="index" options={{ title: "Account" }} />
            <Stack.Screen name="loginForm" options={{ title: "Login" }} />
            <Stack.Screen name="createForm" options={{ title: "Create Account" }} />
        </Stack> 
    );
}   
