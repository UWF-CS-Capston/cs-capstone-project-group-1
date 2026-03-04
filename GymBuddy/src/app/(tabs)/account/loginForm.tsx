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
    
    return (
        <MainView>
            <FormView>
                <FormField placeholder="Email" value={email} onChange={setEmail} />
                <FormField placeholder="Password" value={password} onChange={setPassword} secureTextEntry />
                <View style ={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                    <FormButton title="Sign Up" onPress={ () => router.push('/account/createForm')} />
                    <FormButton title="Login" onPress={() => setMessage("Attempting login...")} />
                </View>
                <Text style={{ marginTop: 20 }}>{message}</Text>
            </FormView>
        </MainView>
    )
}