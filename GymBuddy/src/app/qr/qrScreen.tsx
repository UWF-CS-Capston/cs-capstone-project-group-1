import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { apiFetch } from "../../utils/api";
import storage from "../../utils/storage";

export default function QrScreen() {
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [code, setCode] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // Load token on mount
    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await storage.getItem('token');
            setToken(storedToken);
        };
        loadToken();
    }, []);

    const fetchQR = async () => {
        // Get fresh token from storage
        const currentToken = await storage.getItem('token');
        
        if (!currentToken) {
            Alert.alert("Error", "Please login first");
            return;
        }

        setIsLoading(true);
        
        try {
            const res = await apiFetch('/api/qr/generate', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${currentToken}`,
            },
            });

            const data = await res.json();

            if (res.ok) {
            setQrImage(data.qr);
            setCode(data.code);
            } else {
            Alert.alert("Error", data.message || "Failed to generate QR");
            }
        } catch (error) {
            console.error('QR generation error:', error);
            Alert.alert("Error", "Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
        };

    return (
        <View style={styles.container}>
            <Button 
                title={isLoading ? "Generating..." : "Generate QR"} 
                onPress={fetchQR} 
                disabled={isLoading}
            />

            {isLoading && <ActivityIndicator size="large" color="#055c49" style={styles.loader} />}

            {qrImage && (
                <>
                    <Image
                        source={{ uri: qrImage }}
                        style={styles.qrImage}
                    />
                    <Text style={styles.codeText}>Backup Code: {code}</Text>
                </>
            )}
            
            {!token && (
                <Text style={styles.loginText}>Please login to generate QR codes</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#06d3a7',
        padding: 20,
    },
    qrImage: {
        width: 250,
        height: 250,
        marginTop: 20,
        borderRadius: 10,
    },
    codeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#055c49',
        marginTop: 15,
    },
    loader: {
        marginTop: 20,
    },
    loginText: {
        marginTop: 20,
        fontSize: 16,
        color: '#055c49',
        textAlign: 'center',
    },
});