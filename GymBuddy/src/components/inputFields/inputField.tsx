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
        padding: 10,
        borderWidth: 3,
        borderColor: '#009e6c',
        borderRadius: 5,
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 5,
        marginRight: 10,
        backgroundColor: '#ffffff',
        color: '#055c49',
        textDecorationColor: '#055c49',
    }
})