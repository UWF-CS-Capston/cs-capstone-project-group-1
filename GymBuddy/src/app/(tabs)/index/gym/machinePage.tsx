import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MainView from "../../../../components/views/mainView";
import NavButton from "../../../../components/buttons/navButton";
import MachineView from "../../../../components/views/machineView";
import { router } from "expo-router";
import { apiFetch } from "../../../../utils/api";
import storage from "../../../../utils/storage";

type MachineSummary = {
    id: number;
    name: string;
    queue_count: number | string;
    active_user_email?: string | null;
    active_started_at?: string | null;
};

type MachineStatus = {
    position: number | null;
    isUsing: boolean;
};

type QueueEntry = {
    user_id: number;
    email: string;
    joined_at: string;
    wait_seconds: number;
    position: number;
};

type ActiveUser = {
    user_id: number;
    email: string;
    started_at: string;
    active_seconds: number;
};

type MachineDetails = {
    machine: {
        id: number;
        name: string;
    };
    activeUser: ActiveUser | null;
    queue: QueueEntry[];
    currentUserQueue: QueueEntry | null;
    currentUserUsing: {
        active_seconds: number;
        started_at: string | null;
    } | null;
};

const formatDuration = (seconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;

    if (hrs > 0) {
        return `${hrs}h ${remMins}m ${secs}s`;
    }

    return `${mins}m ${secs}s`;
};

export default function MachinePage() {
    const [machines, setMachines] = useState<MachineSummary[]>([]);
    const [machineStatuses, setMachineStatuses] = useState<Record<number, MachineStatus>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<MachineDetails | null>(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        void loadMachines();
    }, []);

    useEffect(() => {
        if (!selectedMachine) {
            return;
        }

        const timer = setInterval(() => {
            setSelectedMachine((prev) => {
                if (!prev) {
                    return prev;
                }

                return {
                    ...prev,
                    activeUser: prev.activeUser
                        ? {
                            ...prev.activeUser,
                            active_seconds: prev.activeUser.active_seconds + 1,
                        }
                        : null,
                    queue: prev.queue.map((entry) => ({
                        ...entry,
                        wait_seconds: entry.wait_seconds + 1,
                    })),
                    currentUserQueue: prev.currentUserQueue
                        ? {
                            ...prev.currentUserQueue,
                            wait_seconds: prev.currentUserQueue.wait_seconds + 1,
                        }
                        : null,
                    currentUserUsing: prev.currentUserUsing
                        ? {
                            ...prev.currentUserUsing,
                            active_seconds: prev.currentUserUsing.active_seconds + 1,
                        }
                        : null,
                };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [selectedMachine]);

    const getToken = async () => {
        try {
            return await storage.getItem("token");
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    };

    const loadMachines = async () => {
        setIsLoading(true);

        try {
            const res = await apiFetch("/api/machines");
            const data = await res.json();

            if (!res.ok || !Array.isArray(data)) {
                throw new Error(data?.message || "Failed to load machines");
            }

            setMachines(data);

            const token = await getToken();
            if (!token) {
                setMachineStatuses({});
                return;
            }

            const statusEntries = await Promise.all(
                data.map(async (machine: MachineSummary) => {
                    try {
                        const statusRes = await apiFetch(`/api/machines/${machine.id}/position`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        const statusData = await statusRes.json();

                        if (!statusRes.ok) {
                            return [machine.id, { position: null, isUsing: false }] as const;
                        }

                        return [
                            machine.id,
                            {
                                position:
                                    typeof statusData.position === "number"
                                        ? statusData.position
                                        : null,
                                isUsing: !!statusData.isUsing,
                            },
                        ] as const;
                    } catch (error) {
                        console.warn("Status lookup failed for machine", machine.id, error);
                        return [machine.id, { position: null, isUsing: false }] as const;
                    }
                })
            );

            setMachineStatuses(Object.fromEntries(statusEntries));
        } catch (error) {
            console.error("Error loading machines:", error);
            Alert.alert("Error", "Failed to load machines. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const loadMachineDetails = async (machineId: number) => {
        const token = await getToken();

        if (!token) {
            Alert.alert("Not Logged In", "You must be logged in to view machine details.");
            return;
        }

        setDetailsLoading(true);
        setDetailsVisible(true);

        try {
            const res = await apiFetch(`/api/machines/${machineId}/details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Failed to fetch machine details");
            }

            setSelectedMachine(data);
        } catch (error) {
            console.error("Error loading machine details:", error);
            setDetailsVisible(false);
            Alert.alert("Error", "Failed to load machine details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    const refreshMachineDetailsIfOpen = async (machineId: number) => {
        if (selectedMachine?.machine.id === machineId && detailsVisible) {
            await loadMachineDetails(machineId);
        }
    };

    const joinQueue = async (machineId: number) => {
        const token = await getToken();

        if (!token) {
            Alert.alert("Not Logged In", "You must be logged in to join a queue.");
            return;
        }

        try {
            const res = await apiFetch(`/api/machines/${machineId}/join`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                Alert.alert("Error", data?.message || "Could not join this machine.");
                return;
            }

            await loadMachines();
            await refreshMachineDetailsIfOpen(machineId);
        } catch (error) {
            console.error("Error joining queue:", error);
            Alert.alert("Error", "Failed to join queue.");
        }
    };

    const leaveQueue = async (machineId: number) => {
        const token = await getToken();

        if (!token) {
            Alert.alert("Not Logged In", "You must be logged in to leave a queue.");
            return;
        }

        try {
            const res = await apiFetch(`/api/machines/${machineId}/leave`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                Alert.alert("Error", data?.message || "Could not leave this machine.");
                return;
            }

            await loadMachines();
            await refreshMachineDetailsIfOpen(machineId);
        } catch (error) {
            console.error("Error leaving queue:", error);
            Alert.alert("Error", "Failed to leave queue.");
        }
    };

    return (
        <MainView>
            <Text style={styles.pageTitle}>
                Select a machine to view details and manage your queue position.
            </Text>
            <View style={styles.cardWrap}>
                {machines.map((machine) => {
                    const status = machineStatuses[machine.id] ?? {
                        position: null,
                        isUsing: false,
                    };

                    return (
                        <MachineView
                            key={machine.id}
                            title={machine.name}
                            queue={Number(machine.queue_count) || 0}
                            position={status.position}
                            isUsing={status.isUsing}
                            isJoined={status.isUsing || status.position !== null}
                            isLoading={isLoading || detailsLoading}
                            onJoin={() => void joinQueue(machine.id)}
                            onLeave={() => void leaveQueue(machine.id)}
                            onPress={() => void loadMachineDetails(machine.id)}
                        />
                    );
                })}
            </View>
            <NavButton
                title="Return Gym Page"
                onPress={() => {
                    router.dismiss();
                }}
            />

            <Modal
                animationType="slide"
                transparent
                visible={detailsVisible}
                onRequestClose={() => {
                    setDetailsVisible(false);
                    setSelectedMachine(null);
                }}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        {detailsLoading || !selectedMachine ? (
                            <View style={styles.loadingWrap}>
                                <ActivityIndicator size="large" color="#055c49" />
                                <Text style={styles.modalBodyText}>Loading machine details...</Text>
                            </View>
                        ) : (
                            <ScrollView contentContainerStyle={styles.modalContent}>
                                <Text style={styles.modalTitle}>{selectedMachine.machine.name}</Text>
                                <Text style={styles.sectionTitle}>Current Machine User</Text>
                                {selectedMachine.activeUser ? (
                                    <>
                                        <Text style={styles.modalBodyText}>
                                            {selectedMachine.activeUser.email}
                                        </Text>
                                        <Text style={styles.modalSubText}>
                                            Using for {formatDuration(selectedMachine.activeUser.active_seconds)}
                                        </Text>
                                    </>
                                ) : (
                                    <Text style={styles.modalBodyText}>
                                        No one is currently using this machine.
                                    </Text>
                                )}

                                <Text style={styles.sectionTitle}>Your Status</Text>
                                {selectedMachine.currentUserUsing ? (
                                    <Text style={styles.modalBodyText}>
                                        You are currently using this machine for{" "}
                                        {formatDuration(selectedMachine.currentUserUsing.active_seconds)}.
                                    </Text>
                                ) : selectedMachine.currentUserQueue ? (
                                    <>
                                        <Text style={styles.modalBodyText}>
                                            You are #{selectedMachine.currentUserQueue.position} in line.
                                        </Text>
                                        <Text style={styles.modalSubText}>
                                            Waiting for{" "}
                                            {formatDuration(selectedMachine.currentUserQueue.wait_seconds)}
                                        </Text>
                                    </>
                                ) : (
                                    <Text style={styles.modalBodyText}>
                                        You are not currently using or queued for this machine.
                                    </Text>
                                )}

                                <Text style={styles.sectionTitle}>Queue List</Text>
                                {selectedMachine.queue.length === 0 ? (
                                    <Text style={styles.modalBodyText}>No one is currently waiting.</Text>
                                ) : (
                                    selectedMachine.queue.map((entry) => (
                                        <View key={`${entry.user_id}-${entry.position}`} style={styles.queueRow}>
                                            <Text style={styles.queueName}>
                                                #{entry.position} {entry.email}
                                            </Text>
                                            <Text style={styles.queueTime}>
                                                Waiting {formatDuration(entry.wait_seconds)}
                                            </Text>
                                        </View>
                                    ))
                                )}

                                <View style={styles.modalButtons}>
                                    <NavButton
                                        title="Close"
                                        onPress={() => {
                                            setDetailsVisible(false);
                                            setSelectedMachine(null);
                                        }}
                                    />
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </MainView>
    );
}

const styles = StyleSheet.create({
    pageTitle: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 40,
        marginBottom: 12,
        color: "#055c49",
        paddingHorizontal: 24,
    },
    cardWrap: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        margin: 20,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalCard: {
        width: "100%",
        maxWidth: 680,
        maxHeight: "85%",
        backgroundColor: "#09dcb0",
        borderRadius: 18,
        borderWidth: 2,
        borderColor: "#0ef0bf",
        padding: 20,
    },
    modalContent: {
        paddingBottom: 10,
    },
    loadingWrap: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#055c49",
        marginBottom: 16,
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#055c49",
        marginTop: 16,
        marginBottom: 8,
    },
    modalBodyText: {
        fontSize: 16,
        color: "#055c49",
        marginBottom: 6,
    },
    modalSubText: {
        fontSize: 15,
        color: "#055c49",
        opacity: 0.85,
    },
    queueRow: {
        borderWidth: 1,
        borderColor: "#0ef0bf",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#12c8a1",
    },
    queueName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#055c49",
    },
    queueTime: {
        marginTop: 4,
        color: "#055c49",
        fontSize: 14,
    },
    modalButtons: {
        marginTop: 16,
        alignItems: "center",
    },
});
