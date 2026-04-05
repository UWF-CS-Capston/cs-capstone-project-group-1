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
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: "center", marginTop: 20, marginBottom: 20 }}>
                        Welcome to GymBuddy!
                    </Text>
                    
                    <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 15, lineHeight: 24 }}>
                        Track gym occupancy in real-time and plan your workout when it's least crowded.
                    </Text>
                    
                    <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 15, lineHeight: 24 }}>
                        🏋️ Check live gym capacity{'\n'}
                        📱 Get your personal QR code{'\n'}
                        ⏰ Find the best time to visit
                    </Text>
                    
                    <View style={{ marginTop: 20 }}>
                        <NavButton 
                            title="Login to Get Started" 
                            onPress={() => router.push('/(tabs)/account/loginForm')} 
                        />
                    </View>
                </View>
            </MainView>
        );
    }

    // Logged-in user view
    return (
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                Welcome back to GymBuddy!
            </Text>
            
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
