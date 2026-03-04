import React from 'react';
import { Text, View } from 'react-native';
import FormField from '../../../components/inputFields/inputField';
import FormButton from '../../../components/buttons/formButtons';
import FormView from '../../../components/views/formView';
import NavButton from '../../../components/buttons/navButton';
import { router } from 'expo-router';
import MainView from '../../../components/views/mainView';

export default function CreateForm() {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [message, setMessage] = React.useState("");

    return (
        <MainView>
            <FormView>
                <FormField placeholder="Email" value={email} onChange={setEmail} />
                <FormField placeholder="Name" value={name} onChange={setName} />   
                <FormField placeholder="Password" value={password} onChange={setPassword} secureTextEntry />
                <FormField placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} secureTextEntry />
                <View style ={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                    <FormButton title="Back to Login" onPress={() =>
                        router.dismiss()
                    } />
                    <FormButton title="Create Account" onPress={() => setMessage("Attempting to create account...")} />
                </View>
                <Text style={{ marginTop: 20 }}>{message}</Text>
            </FormView>
        </MainView>
    )
}  