import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#09eba3',
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: { backgroundColor: '#055c49' },
                tabBarPosition: 'bottom',
                tabBarHideOnKeyboard: true,
                tabBarAllowFontScaling: true,
            }}
        >
            <Tabs.Screen name="index" options={{ 
                title: "Home",
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={size} color={color} />
                ),     
                }} 
            />
            <Tabs.Screen name="scan" options={{ 
                title: "Scan",
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'qr-code-sharp' : 'qr-code-outline'} size={24} color={color} />
                ),     
                }} 
            />
            <Tabs.Screen name="account" options={{ 
                title: "Account", 
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'person-sharp' : 'person-outline'} size={size} color={color} />
                ),
                }} 
            />
            <Tabs.Screen name="settings" options={{ 
                title: "Settings", 
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'settings-sharp' : 'settings-outline'} size={size} color={color} />
                ), 
                }} 
            />
        </Tabs>
    );
}