import React from "react";
import { Alert, Text, View } from "react-native";
import MainView from "../../../../components/views/mainView";
import NavButton from "../../../../components/buttons/navButton";
import MachineView from "../../../../components/views/machineView";
import { router } from "expo-router";
import { apiFetch } from "../../../../utils/api";

export default function WorkoutPage() {
    
    return (
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                This is the Workout View page. More features coming soon!
            </Text>
            <NavButton title="Return Gym Page" onPress={ () => {
                router.dismiss()
            }} />
        </MainView>
    );
}