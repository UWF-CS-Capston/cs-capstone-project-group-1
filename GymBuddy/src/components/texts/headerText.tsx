import React from "react";
import { Text, StyleSheet } from "react-native";

export default function HeaderText({ children }: { children: React.ReactNode }) {
    return <Text style={styles.header}>{children}</Text>;
}

const styles = StyleSheet.create({
    header: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 10,
        marginLeft: 10,
        color: '#053a2e',
        borderBottomWidth: 3,
        borderBottomColor: '#053a2e',
        paddingBottom: 5,
    },
});