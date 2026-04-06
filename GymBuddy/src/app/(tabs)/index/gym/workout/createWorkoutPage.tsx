import React from "react";
import { Alert, Text, View } from "react-native";
import MainView from "../../../../../components/views/mainView";
import NavButton from "../../../../../components/buttons/navButton";
import FormButton from "../../../../../components/buttons/formButtons";
import FormField from "../../../../../components/inputFields/inputField";
import { router } from "expo-router";

export default function CreateWorkoutPage() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [reps, setReps] = React.useState("");

    return (
        <MainView>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                Create Workout
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Enter workout details below:
            </Text>
            <FormField placeholder="Workout Title" value={title} onChange={setTitle} />
            <FormField placeholder="Description" value={description} onChange={setDescription} />
            <FormField placeholder="Reps" value={reps} onChange={setReps} keyboardType="numeric" />
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <NavButton 
                    title="Go Back" 
                    onPress={() => router.dismiss()}
                />
                <FormButton 
                    title="Create" 
                    onPress={() => Alert.alert("Workout Created!", `Title: ${title}\nDescription: ${description}\nReps: ${reps}`)}
                />
            </View>
        </MainView>
    );
}
