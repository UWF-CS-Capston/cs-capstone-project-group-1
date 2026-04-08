import React from "react";
import { TextInput } from "react-native";

interface NumberFieldProps {
    placeholder?: string;
    value: string;
    onChange: (text: string) => void;
}

export default function NumberField({ placeholder, value, onChange }: NumberFieldProps) {
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            style={{
                width: 300,
                padding: 15,
                borderWidth: 1,
                borderColor: '#09eba3',
                borderRadius: 15,
                marginBottom: 15,
                backgroundColor: '#09eba3',
                color: '#055c49',
            }}
        />
    );
}