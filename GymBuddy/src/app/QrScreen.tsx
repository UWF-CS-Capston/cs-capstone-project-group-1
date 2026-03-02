import React, { useState } from "react";
import { View, Text, Button, Image } from "react-native";

export default function QrScreen() {
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [code, setCode] = useState<number | null>(null);

    const fetchQR = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/qr/generate", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        setQrImage(data.qr);
        setCode(data.code);
    };

    return (
        <View style={{ alignItems: "center", marginTop: 40 }}>
            <Button title="Generate QR" onPress={fetchQR} />

            {qrImage && (
                <>
                    <Image
                        source={{ uri: qrImage }}
                        style={{ width: 200, height: 200, marginTop: 20 }}
                    />
                    <Text style={{ marginTop: 10 }}>Backup Code: {code}</Text>
                </>
            )}
        </View>
    );
}