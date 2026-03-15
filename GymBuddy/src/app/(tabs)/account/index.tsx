import React, { useEffect } from "react";
import { Text } from "react-native";
import MainView from "../../../components/views/mainView";
import { router } from "expo-router";

export default function Index() {

    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/account/loginForm");
        }
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                Welcome back to GymBuddy!
            </Text>
        </MainView>
    );
}