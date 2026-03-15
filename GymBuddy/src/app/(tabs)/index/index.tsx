import { Text, View } from "react-native";
import { router } from "expo-router";
import MainView from "../../../components/views/mainView";
import NavButton from "../../../components/buttons/navButton";
import { useAuth } from "../../../contexts/AuthContext";

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
                
                <NavButton 
                    title="Go to Machine View" 
                    onPress={() => router.push('/machinePage')} 
                />
            </View>
            
            {isLoggedIn && (
                <View style={{ marginTop: 20 }}>
                    <NavButton 
                        title="Go to Account" 
                        onPress={() => router.push('/account')} 
                    />
                </View>
            )}
        </MainView>
    );
}