import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View
} from 'react-native';

export default function App() {
  const [qrImage, setQrImage] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQrImage("");
          setQrCode("");
          setMessage("QR expired ❌");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const register = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registered successfully ✅");
      } else {
        setMessage(data.message || "Register failed ❌");
      }

    } catch (err) {
      console.log(err);
      setMessage("Error connecting to backend ❌");
    }
  };

  const login = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token); // 🔥 store JWT
        setToken(data.token);
        setMessage("Login successful ✅");
      } else {
        setMessage(data.message || "Login failed ❌");
      }

    } catch (err) {
      console.log(err);
      setMessage("Error connecting to backend ❌");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMessage("Logged out");
  };
  const generateQR = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/qr/generate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // 👈 use state token
        },
      });

      const data = await res.json();
      console.log("QR Response:", data);

      if (res.ok) {
        setQrImage(data.qr);
        setQrCode(data.code);
        setExpiresIn(data.expiresIn);
        setTimeLeft(data.expiresIn);
        setMessage("QR generated successfully ✅");
      }

    } catch (err) {
      console.log("Fetch error:", err);
      alert("Error connecting to backend ❌");
    }
  };
  // If authenticated
  if (token) {
    return (
      <View style={styles.container}>
        <Text>Authenticated 🎉</Text>
        <Text numberOfLines={1}>Token: {token}</Text>

        <Button title="Generate QR" onPress={generateQR} />
        <View style={{ height: 15 }} />

        {qrImage !== "" && (
          <>
            <Image
              source={{ uri: qrImage }}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ marginTop: 10, fontSize: 18 }}>
              Code: {qrCode}
            </Text>
            <Text style={{ marginTop: 5 }}>
              Expires in: {timeLeft} seconds
            </Text>
            <View style={{ height: 15 }} />
          </>
        )}

        <Button title="Logout" onPress={logout} />
        <Text style={{ marginTop: 10 }}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>GymBuddy Auth</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Register" onPress={register} />
      <View style={{ height: 10 }} />
      <Button title="Login" onPress={login} />

      <Text style={{ marginTop: 15 }}>{message}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 250,
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    borderRadius: 5
  }
});