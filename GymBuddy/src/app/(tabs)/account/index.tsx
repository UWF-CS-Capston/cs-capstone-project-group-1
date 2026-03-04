import React from 'react';
import { Text, Button} from 'react-native';
import MainView from '../../../components/views/mainView';
import { router } from 'expo-router';

var isAuthenticated: boolean = false; // Placeholder for authentication state

export default function Index() {
    return (
        (isAuthenticated) ?
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                Welcome back to GymBuddy!
            </Text> 
        </MainView> : 
        router.push('/account/loginForm')
    );
}