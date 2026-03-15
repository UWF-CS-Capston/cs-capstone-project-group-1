import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { Text, View } from 'react-native';

export default function RootLayout() {
    const { role, isLoading, token } = useAuth();
    
    // Debug: log the role to see what it is
    console.log('Current role:', role);
    console.log('Is authenticated:', !!token);
    
    const isStaff = role === 'staff' || role === 'admin';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#09eba3',
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: { backgroundColor: '#055c49' },
                tabBarPosition: 'bottom',
                tabBarHideOnKeyboard: true,
                tabBarAllowFontScaling: true,
            }}
        >
            <Tabs.Screen
                name="machines"
                options={{
                    title: "Machines",
                }}
            />
            <Tabs.Screen name="index" options={{
                title: "Home",
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={size} color={color} />
                ),     
            }} />
            
            <Tabs.Screen name="scan" options={{ 
                title: "Scan",
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'qr-code-sharp' : 'qr-code-outline'} size={24} color={color} />
                ),     
            }} />
            
            {/* Only show employee tab for staff/admin */}
            {isStaff && (
                <Tabs.Screen name="employee" options={{
                    title: "Employee",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? 'people-sharp' : 'people-outline'} size={size} color={color} />
                    ),
                }} />
            )}
            
            <Tabs.Screen name="account" options={{ 
                title: "Account", 
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'person-sharp' : 'person-outline'} size={size} color={color} />
                ),
            }} />
            
            <Tabs.Screen name="settings" options={{ 
                title: "Settings", 
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'settings-sharp' : 'settings-outline'} size={size} color={color} />
                ), 
            }} />
        </Tabs>
    );
}