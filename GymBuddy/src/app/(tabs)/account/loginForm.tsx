import React from 'react';
import { Text, View } from 'react-native';
import FormField from '../../../components/inputFields/inputField';
import FormButton from '../../../components/buttons/formButtons';
import FormView from '../../../components/views/formView';
import { router } from 'expo-router';
import MainView from '../../../components/views/mainView';

export default function LoginForm() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Login successful ✅");
                localStorage.setItem("token", data.token);
                router.push('/account');
            } else {
                setMessage(data.message || "Login failed ❌");
            }
        } catch (error) {
            setMessage("Login failed ❌");
        }
    };
    
    return (
        <MainView>
            <FormView>
                <FormField placeholder="Email" value={email} onChange={setEmail} />
                <FormField placeholder="Password" value={password} onChange={setPassword} secureTextEntry />
                <View style ={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                    <FormButton title="Sign Up" onPress={ () => router.push('/account/createForm')} />
                    <FormButton title="Login" onPress={() => {
                        handleLogin();
                    }} />
                </View>
                <Text style={{ marginTop: 20 }}>{message}</Text>
            </FormView>
        </MainView>
    )
}