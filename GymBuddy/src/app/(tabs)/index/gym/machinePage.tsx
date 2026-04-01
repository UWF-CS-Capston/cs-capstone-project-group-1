import react from "react";
import { Alert, Text, View } from "react-native";
import MainView from "../../../../components/views/mainView";
import NavButton from "../../../../components/buttons/navButton";
import MachineView from "../../../../components/views/machineView";
import { router } from "expo-router";
import { apiFetch } from "../../../../utils/api";

import bench from "../../../../assets/machines/bench-press.png";
import legpress from "../../../../assets/machines/leg-press-machine.png";
import treadmill from "../../../../assets/machines/treadmill.png";
import latpulldown from "../../../../assets/machines/lat-pulldown.png";
import React from "react";
import storage from "../../../../utils/storage";

const machineImages: any = {
    "Bench Press": bench,
    "Leg Press": legpress,
    "Treadmill": treadmill,
    "Lat Pulldown": latpulldown
};

export default function MachinePage() {
    const [machines, setMachines] = react.useState<any[]>([]);
    const [positions, setPositions] = react.useState<{ [key: number]: number | undefined }>({});
    const [joined, setJoined] = react.useState<{ [key: number]: boolean }>({});
    const [isLoading, setIsLoading] = react.useState(false);

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
            Alert.alert('Error', 'Failed to load machines. Please try again later.');
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
                    [machineId]: undefined
                }));
    
                await loadMachines();
            } catch (error) {
                console.error('Error leaving queue:', error);
                Alert.alert("Error", "Failed to leave queue");
            }
        };

    return (
        <MainView>
            <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
                Select a machine to view details and manage your queue position.
            </Text>
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center', 
                margin: 20
                }} >
                {machines.map((m) => (
                    <MachineView
                        key={m.id}
                        title={m.name}
                        image={machineImages[m.name] || null}
                        queue={m.queue_length}
                        position={positions[m.id]}
                        joined={joined[m.id] || false}
                        isLoading={isLoading}
                        onJoin={() => joinQueue(m.id)}
                        onLeave={() => leaveQueue(m.id)}
                        onPress={() => {
                            // Optional: navigate to machine detail page
                        }}
                     />
                 ))}
                </View>
            <NavButton title="Return Gym Page" onPress={ () => {
                router.dismiss()
            }} />
        </MainView>
    );
}