import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

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

  if (token) {
    return (
      <View style={styles.container}>
        <Text>Authenticated 🎉</Text>
        <Text numberOfLines={1}>Token: {token}</Text>
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