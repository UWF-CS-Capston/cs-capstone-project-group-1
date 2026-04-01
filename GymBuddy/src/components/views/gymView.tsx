import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

interface GymViewProps {
    title: string;
    occupancy: number;
    occupancyLimit: number;
    open: boolean;
    address: string;
    onPress?: () => void;
}

export default function GymView({ title, occupancy, occupancyLimit, open, address, onPress }: GymViewProps) {
    return (
        <View style={styles.container}>
            <Pressable onPress={onPress}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.occupancy}>
                    {occupancy} / {occupancyLimit}
                </Text>
                <Text style={styles.address}>{address}</Text>
                <Text style={styles.open}>
                    {open ? "Open" : "Closed"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#06b690",
        margin: 10,
        borderColor: "#09eba3",
        borderWidth: 2,
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#055c49",
    },
    occupancy: {
        fontSize: 18,
        color: "#055c49",
        marginTop: 10,
    },
    address: {
        fontSize: 16,
        color: "#055c49",
        marginTop: 5,
    },
    open: {
        fontSize: 16,
        color: "#055c49",
        marginTop: 5,
    },
    button: {
        marginTop: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: "#09eba3",
        borderRadius: 15,
        backgroundColor: "#09eba3",
    },
    buttonText: {
        color: "#055c49",
        textAlign: "center",
        fontWeight: "bold",
    },
});