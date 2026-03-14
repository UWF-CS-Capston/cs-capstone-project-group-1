import { Text, View } from "react-native";
import { Link, router } from "expo-router";
import MainView from "../../../components/views/mainView";
import NavButton from "../../../components/buttons/navButton";

export default function Index() {
    return (
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                Welcome to GymBuddy! Please login to continue.
            </Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                marginTop: 20
            }} >

                <NavButton title="Go to Account" to="/account" />

                <NavButton title="Go to Machine View" to="/machinePage" />
                }} />
            </View>

        </MainView>
    );
}
