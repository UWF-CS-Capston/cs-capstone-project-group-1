import react from "react";
import { Alert, Text, View } from "react-native";
import MainView from "../../../components/views/mainView";
import NavButton from "../../../components/buttons/navButton";
import MachineView from "../../../components/views/machineView";
import { router } from "expo-router";

export default function MachinePage() {
    
    return (
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                This is the Machine View page. More features coming soon!
            </Text>
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center', 
                margin: 20
                }} >
                    <MachineView title="Bench Press" machines={5} inUse={1} onPress={ () => {
                        Alert.alert("machine view unavalible")
                    }}/>
                    <MachineView title="Treadmill" machines={10} inUse={4} onPress={ () => {
                        Alert.alert("machine view unabalible")
                    }}/>
                </View>
            <NavButton title="Return to home" onPress={ () => {
                router.dismiss()
            }} />
        </MainView>
    );
}