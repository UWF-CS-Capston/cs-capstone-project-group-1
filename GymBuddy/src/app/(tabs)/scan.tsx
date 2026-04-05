import { Text, View } from 'react-native';
import MainView from '../../components/views/mainView';
import Index from '../qr/index';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import FormButton from '../../components/buttons/formButtons';

export default function Scan() {
    const { token } = useAuth();

    return (
        <MainView>
            {token ? (
                <Index />
            ) : (
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                    <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 20 }}>
                        Please login to view your QR code.
                    </Text>
                    <FormButton title="Go to Login" onPress={() => router.push('/account/loginForm')} />
                </View>
            )}
        </MainView>
    );
}