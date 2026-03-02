import { Text } from 'react-native';
import MainView from '../../components/views/mainView';
import LoginForm from '../account/login/loginForm';

const isAuthenticated = false; // Placeholder for authentication state

export default function Account() {
    if (!isAuthenticated) { // Placeholder for authentication check
        return (
            <MainView>
                <LoginForm />
            </MainView>
        );
    }

    return (
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                Welcome to GymBuddy! Please login to continue.
            </Text>
        </MainView>
    );
}