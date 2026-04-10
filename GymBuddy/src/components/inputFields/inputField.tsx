import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
    placeholder?: string;
    value: string;
    onChange: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export default function FormField({ placeholder, value, onChange, secureTextEntry, keyboardType }: InputFieldProps) {
    return (
        <TextInput 
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            style={styles.input}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        width: 200,
        padding: 15,
        borderWidth: 1,
        borderColor: '#09eba3',
        borderRadius: 15,
        margin: 10,
        backgroundColor: '#09eba3',
        color: '#055c49',
    }
})