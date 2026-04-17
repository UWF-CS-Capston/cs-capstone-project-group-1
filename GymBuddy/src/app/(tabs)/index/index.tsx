import { Text, View } from "react-native";
import { router } from "expo-router";
import MainView from "../../../components/views/mainView";
import NavButton from "../../../components/buttons/navButton";
import GymView from "../../../components/views/gymView";
import HeaderText from "../../../components/texts/headerText";
import ParagraphText from "../../../components/texts/paragraphText";
import { useAuth } from "../../../contexts/AuthContext";

const mockGymData = {
    title: "Downtown Gym",
    occupancy: 35,
    occupancyLimit: 100,
    open: true,
    address: "123 Main St, Anytown",
};

export default function Index() {
    const { token, isLoading } = useAuth();
    const isLoggedIn = !!token;

    if (isLoading) {
        return (
            <MainView>
                <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                    Loading...
                </Text>
            </MainView>
        );
    }

    // Information page for non-logged-in users
    if (!isLoggedIn) {
        return (
            <MainView>
                <HeaderText>
                    Welcome to GymBuddy!
                </HeaderText>
                
                <ParagraphText>
                    The best gym management app designed to create a better gym experience for workout enthusiasts and gym owners alike.
                </ParagraphText>

                

                <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 35 }}>
                    <NavButton 
                        title="Login to Get Started" 
                        onPress={() => router.push('/gym')} //temporary redirect to gym page for testing purposes, change to login form when implemented
                        //onPress={() => router.push('/(tabs)/account/loginForm')} 
                    />
                </View>
                
                <ParagraphText>
                    GymBuddy provides users with real-time gym occupancy, allowing customers to plan their workouts at the most optimal times and gym owners to manager their facilites 
                    more efficiently.
                </ParagraphText>
            </MainView>
        );
    }
    else{
        // Logged-in user view
        return (
            <MainView>
                <HeaderText>
                    Welcome back to GymBuddy!
                </HeaderText>
                
                <View style={{ marginTop: 20 }}>
                    <GymView 
                        title={mockGymData.title}
                        occupancy={mockGymData.occupancy}
                        occupancyLimit={mockGymData.occupancyLimit}
                        open={mockGymData.open}
                        address={mockGymData.address}
                        onPress={() => router.push('/gym')}
                    />
                    <NavButton 
                        title="Go to Account" 
                        onPress={() => router.push('/account')} 
                    />
                </View>
            </MainView>
        );
    }

    
}
