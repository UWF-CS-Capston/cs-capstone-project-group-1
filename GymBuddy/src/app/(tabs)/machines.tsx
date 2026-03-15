import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";

import bench from "../../../assets/machines/bench-press.png";
import legpress from "../../../assets/machines/leg-press-machine.png";
import treadmill from "../../../assets/machines/treadmill.png";
import latpulldown from "../../../assets/machines/lat-pulldown.png";

const machineImages: any = {
    "Bench Press": bench,
    "Leg Press": legpress,
    "Treadmill": treadmill,
    "Lat Pulldown": latpulldown
};

export default function Machines() {

    const [machines, setMachines] = React.useState<any[]>([]);
    const [positions, setPositions] = React.useState<{ [key: number]: number | null }>({});
    const [joined, setJoined] = React.useState<{ [key: number]: boolean }>({});

    const token = localStorage.getItem("token");

    /*
    Load machines
    */
    React.useEffect(() => {
        loadMachines();
    }, []);

    const loadMachines = async () => {

        const res = await fetch("http://localhost:5000/api/machines");
        const data = await res.json();
        setMachines(data);

        if (!token) return;

        for (const m of data) {
            try {

                const posRes = await fetch(
                    `http://localhost:5000/api/machines/${m.id}/position`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (posRes.ok) {
                    const posData = await posRes.json();

                    if (posData.position !== null && posData.position !== undefined) {

                        setJoined(prev => ({
                            ...prev,
                            [m.id]: true
                        }));

                        setPositions(prev => ({
                            ...prev,
                            [m.id]: posData.position
                        }));

                    }

                }

            } catch (err) {
                console.warn("Position lookup failed", err);
            }
        }
    };

    /*
    Join queue
    */
    const joinQueue = async (machineId: number) => {

        if (!token) {
            alert("You must be logged in");
            return;
        }

        const res = await fetch(
            `http://localhost:5000/api/machines/${machineId}/join`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            alert(err?.message || "Already in queue or request failed");
            return;
        }

        setJoined(prev => ({
            ...prev,
            [machineId]: true
        }));

        try {

            const posRes = await fetch(
                `http://localhost:5000/api/machines/${machineId}/position`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (posRes.ok) {
                const posData = await posRes.json();

                setPositions(prev => ({
                    ...prev,
                    [machineId]: posData.position
                }));
            }

        } catch (err) {
            console.warn("Position fetch failed", err);
        }

        await loadMachines();
    };

    /*
    Leave queue
    */
    const leaveQueue = async (machineId: number) => {

        if (!token) return;

        const res = await fetch(
            `http://localhost:5000/api/machines/${machineId}/leave`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!res.ok) {
            console.error("Leave queue failed");
            return;
        }

        setJoined(prev => ({
            ...prev,
            [machineId]: false
        }));

        setPositions(prev => ({
            ...prev,
            [machineId]: null
        }));

        await loadMachines();
    };

    const renderMachine = ({ item }: any) => (

        <View style={styles.card}>

            <Image
                source={machineImages[item.name]}
                style={styles.image}
            />

            <Text style={styles.machineName}>
                {item.name}
            </Text>

            <Text style={styles.queueCount}>
                {item.queue_count} people in queue
            </Text>

            {positions[item.id] !== undefined && positions[item.id] !== null && (
                <Text style={styles.queueCount}>
                    Your position: {positions[item.id]}
                </Text>
            )}

            <TouchableOpacity
                style={styles.queueButton}
                onPress={() => {
                    if (joined[item.id]) {
                        leaveQueue(item.id);
                    } else {
                        joinQueue(item.id);
                    }
                }}
            >
                <Text style={styles.queueText}>
                    {joined[item.id] ? "Leave Queue" : "Join Queue"}
                </Text>
            </TouchableOpacity>

        </View>
    );

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Gym Machines</Text>

            <FlatList
                data={machines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMachine}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#111",
    },

    title: {
        fontSize: 28,
        color: "white",
        fontWeight: "bold",
        marginBottom: 12,
    },

    card: {
        backgroundColor: "#1f2937",
        padding: 20,
        borderRadius: 12,
        marginBottom: 14,
        alignItems: "center",
    },

    image: {
        width: 90,
        height: 90,
        marginBottom: 10,
        resizeMode: "contain",
    },

    machineName: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },

    queueCount: {
        color: "#9ca3af",
        marginBottom: 10,
    },

    queueButton: {
        backgroundColor: "#22c55e",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 6,
    },

    queueText: {
        color: "white",
        fontWeight: "bold",
    }

});