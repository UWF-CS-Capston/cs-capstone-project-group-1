import { Text } from "react-native";
import { Link } from "expo-router";
import MainView from "../../components/views/mainView";
import React from "react";

export default function Index() {
    return (
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                Welcome to GymBuddy! Please login to continue.
            </Text>
            <Link push href="/account/loginForm" style={{ marginTop: 20, fontSize: 18, color: 'blue' }}>
                Go to Login
            </Link>
        </MainView>
    );
}
