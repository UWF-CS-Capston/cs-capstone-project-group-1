import React from 'react';
import { Text, View } from 'react-native';
import FormField from '../../../components/inputFields/inputField';
import FormButton from '../../../components/buttons/formButtons';
import FormView from '../../../components/views/formView';
import { router } from 'expo-router';
import MainView from '../../../components/views/mainView';
import { apiFetch } from '../../../utils/api';
import HeaderText from '../../../components/texts/headerText';

export default function CreateForm() {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [message, setMessage] = React.useState("");

    const handleCreateAccount = async () => {
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const res = await apiFetch('/api/auth/register', {
            method: "POST",
            body: JSON.stringify({ email, name, password })
            });
            
            const data = await res.json();
            if (res.ok) {
            setMessage("Account created successfully ✅");
            router.push('/account/loginForm');
            } else {
            setMessage(data.message || "Failed to create account.");
            }
        } catch (error) {
            setMessage("Failed to connect to server");
            console.error('Registration error:', error);
        }
    };

    return (
        <MainView>
            <FormView>
                <HeaderText>Create Account</HeaderText>
                <FormField placeholder="Email" value={email} onChange={setEmail} />
                <FormField placeholder="Name" value={name} onChange={setName} />   
                <FormField placeholder="Password" value={password} onChange={setPassword} secureTextEntry />
                <FormField placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} secureTextEntry />
                <View style ={{ flexDirection: 'row', justifyContent: 'center'}}>
                    <FormButton title="Go Back" onPress={() =>
                        router.replace('/account/loginForm')
                    } />
                    <FormButton title="Create" onPress={handleCreateAccount} />
                </View>
                <Text style={{ marginTop: 20 }}>{message}</Text>
            </FormView>
        </MainView>
    )
}  
