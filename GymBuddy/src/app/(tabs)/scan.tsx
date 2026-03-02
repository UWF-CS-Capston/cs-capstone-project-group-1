import { Text, Image } from 'react-native';
import MainView from '../../components/views/mainView';
import Index from '../qr/index';
import { useEffect, useState } from 'react';
import FormButton from '../../components/buttons/formButtons';
import FormView from '../../components/views/formView';

const isAuthenticated = true; // Placeholder for authentication state

export default function Scan() {

    return (
        <MainView>
            {isAuthenticated ? (
                <Index />
            ) : (
                <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                    Please login to view your QR code.
                </Text>
            )}
        </MainView>
    );
}