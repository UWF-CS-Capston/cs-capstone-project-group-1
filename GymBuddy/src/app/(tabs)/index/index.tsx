import { Text, View } from "react-native";
import { router } from "expo-router";
import MainView from "../../../components/views/mainView";
import NavButton from "../../../components/buttons/navButton";
import GymView from "../../../components/views/gymView";
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
    //const isLoggedIn = !!token;
    const isLoggedIn = true; // temporary for testing, replace with actual auth check

    if (isLoading) {
        return (
            <MainView>
                <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                    Loading...
                </Text>
            </MainView>
        );
    }

    return (
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                {isLoggedIn 
                    ? "Welcome back to GymBuddy!" 
                    : "Welcome to GymBuddy! Please login to continue."
                }
            </Text>
            
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center', 
                width: '100%', 
                marginTop: 20
            }}>
                {!isLoggedIn && (
                    <NavButton 
                        title="Go to Account" 
                        onPress={() => router.push('/account')} 
                    />
                )}
                
            </View>
            
            {isLoggedIn && (
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
            )}
        </MainView>
    );
}
