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
        backgroundColor: "#ffffff",
        margin: 10,
        borderColor: "#009e6c",
        borderWidth: 3,
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
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
        borderBottomWidth: 1,
        borderBottomColor: "#009e6c",
        paddingBottom: 5,
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
        width: "50%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        padding: 10,
        borderWidth: 3,
        borderColor: "#009e6c",
        borderRadius: 5,
        backgroundColor: "#ffffff",
    },
    buttonText: {
        color: "#055c49",
        textAlign: "center",
        fontWeight: "bold",
    },
});