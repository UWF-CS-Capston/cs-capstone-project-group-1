import React from 'react';
import { Text, View } from 'react-native';
import FormField from '../../../components/inputFields/inputField';
import FormButton from '../../../components/buttons/formButtons';
import FormView from '../../../components/views/formView';
import { router } from 'expo-router';
import MainView from '../../../components/views/mainView';
import { useAuth } from '../../../contexts/AuthContext';
import { apiFetch } from '../../../utils/api';

export default function LoginForm() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");
    const { login } = useAuth();

    const handleLogin = async () => {
  try {
    const res = await apiFetch('/api/auth/login', {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Login successful ✅");
      login(data.token);
      router.push('/');
    } else {
      setMessage(data.message || "Login failed.");
    }
  } catch (error) {
    setMessage("Login failed: Cannot connect to server");
    console.error('Login error:', error);
  }
};
    
    return (
        <MainView>
            <FormView>
                <FormField placeholder="Email" value={email} onChange={setEmail} />
                <FormField placeholder="Password" value={password} onChange={setPassword} secureTextEntry />
                <View style ={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                    <FormButton title="Sign Up" onPress={ () => router.push('/account/createForm')} />
                    <FormButton title="Login" onPress={handleLogin} />
                </View>
                <Text style={{ marginTop: 20 }}>{message}</Text>
            </FormView>
        </MainView>
    );
}