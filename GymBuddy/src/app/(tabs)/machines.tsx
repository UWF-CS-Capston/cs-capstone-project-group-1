import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import { apiFetch } from "../../utils/api";
import storage from "../../utils/storage";

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
    const [isLoading, setIsLoading] = React.useState(false);

    /*
    Load machines
    */
    React.useEffect(() => {
        loadMachines();
    }, []);

    const getToken = async () => {
        try {
            return await storage.getItem('token');
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    };

    const loadMachines = async () => {
        setIsLoading(true);
        try {
            const res = await apiFetch('/api/machines');
            const data = await res.json();
            setMachines(data);

            const token = await getToken();
            if (!token) {
                setIsLoading(false);
                return;
            }

            // Load positions for all machines
            for (const m of data) {
                try {
                    const posRes = await apiFetch(`/api/machines/${m.id}/position`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

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
                    console.warn("Position lookup failed for machine", m.id, err);
                }
            }
        } catch (error) {
            console.error('Error loading machines:', error);
            Alert.alert("Error", "Failed to load machines");
        } finally {
            setIsLoading(false);
        }
    };

    /*
    Join queue
    */
    const joinQueue = async (machineId: number) => {
        const token = await getToken();
        
        if (!token) {
            Alert.alert("Not Logged In", "You must be logged in to join a queue");
            return;
        }

        try {
            const res = await apiFetch(`/api/machines/${machineId}/join`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                Alert.alert("Error", err?.message || "Already in queue or request failed");
                return;
            }

            setJoined(prev => ({
                ...prev,
                [machineId]: true
            }));

            // Get updated position
            try {
                const posRes = await apiFetch(`/api/machines/${machineId}/position`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

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
        } catch (error) {
            console.error('Error joining queue:', error);
            Alert.alert("Error", "Failed to join queue");
        }
    };

    /*
    Leave queue
    */
    const leaveQueue = async (machineId: number) => {
        const token = await getToken();
        
        if (!token) return;

        try {
            const res = await apiFetch(`/api/machines/${machineId}/leave`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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
        } catch (error) {
            console.error('Error leaving queue:', error);
            Alert.alert("Error", "Failed to leave queue");
        }
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
                <Text style={styles.positionText}>
                    Your position: #{positions[item.id]}
                </Text>
            )}

            <TouchableOpacity
                style={[
                    styles.queueButton,
                    joined[item.id] && styles.leaveButton
                ]}
                onPress={() => {
                    if (joined[item.id]) {
                        leaveQueue(item.id);
                    } else {
                        joinQueue(item.id);
                    }
                }}
                disabled={isLoading}
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

            {isLoading && machines.length === 0 ? (
                <Text style={styles.loadingText}>Loading machines...</Text>
            ) : (
                <FlatList
                    data={machines}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMachine}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    loadingText: {
        color: "#9ca3af",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
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
        marginBottom: 5,
    },
    positionText: {
        color: "#22c55e",
        fontWeight: "600",
        marginBottom: 10,
    },
    queueButton: {
        backgroundColor: "#22c55e",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        minWidth: 120,
        alignItems: "center",
    },
    leaveButton: {
        backgroundColor: "#ef4444",
    },
    queueText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    }
});