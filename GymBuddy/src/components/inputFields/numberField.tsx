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
            }}
        />
    );
}