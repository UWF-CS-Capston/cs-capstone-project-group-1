import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
import FormButton from '../../components/buttons/formButtons';
import FormField from '../../components/inputFields/inputField';
import NavButton from '../../components/buttons/navButton';
import { apiFetch } from '../../utils/api';
import storage from '../../utils/storage';
import { router } from 'expo-router';

export default function Index() {
  const [qrImage, setQrImage] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await storage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };
    loadToken();
  }, []);

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
    setIsLoading(true);
    setMessage("");
    
    try {
      const res = await apiFetch('/api/auth/register', {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registered successfully ✅");
        // Auto-fill email for login
      } else {
        setMessage(data.message || "Register failed ❌");
      }
    } catch (err) {
      console.log(err);
      setMessage("Error connecting to backend ❌");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    setIsLoading(true);
    setMessage("");
    
    try {
      const res = await apiFetch('/api/auth/login', {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Store token using cross-platform storage
        await storage.setItem('token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setMessage("Login successful ✅");
      } else {
        setMessage(data.message || "Login failed ❌");
      }
    } catch (err) {
      console.log(err);
      setMessage("Error connecting to backend ❌");
    } finally {
      setIsLoading(false);
    }
  };



  const generateQR = async () => {
    setIsLoading(true);
    setMessage("");
    
    try {
      // Get fresh token from storage
      const currentToken = await storage.getItem('token');
      
      if (!currentToken) {
        setMessage("Not authenticated. Please login again.");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      console.log('🔑 Using token:', { currentToken });
      
      const res = await apiFetch('/api/qr/generate', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentToken}`,
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
      } else {
        setMessage(data.message || "Failed to generate QR");
        // If unauthorized, log out
        if (res.status === 401 || res.status === 403) {
          await storage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
    } catch (err) {
      console.log("Fetch error:", err);
      Alert.alert("Error", "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  // If authenticated
  if (isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Authenticated 🎉</Text>
        <NavButton 
          title={isLoading ? "Generating..." : "Generate QR"} 
          onPress={generateQR} 
        />
        
        <View style={{ height: 15 }} />

        {isLoading && <ActivityIndicator size="large" color="#055c49" />}

        {qrImage !== "" && (
          <> 
            {/* -- DEBUG CODE BELOW SHOWS TOKEN WHEN UNCOMMENTED -- */}
            {/* <Text style={styles.tokenText}>
              Token: {token}
            </Text> */}
            <Image
              source={{ uri: qrImage }}
              style={styles.qrImage}
            />
            <Text style={styles.codeText}>Code: {qrCode}</Text>
            <Text style={styles.expiryText}>
              Expires in: {timeLeft} seconds
            </Text>
            <View style={{ height: 15 }} />
          </>
        )}

        <NavButton 
          title="Go to Account" 
          onPress={() => router.push('/(tabs)/account')} 
        />
        <Text style={styles.messageText}>{message}</Text>
      </View>
    );
  }

  // Login/Register view
  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>GymBuddy Auth</Text>

      <FormField
        placeholder="Email"
        value={email}
        onChange={setEmail}
      />

      <FormField
        placeholder="Password"
        secureTextEntry
        value={password}
        onChange={setPassword}
      />

      <FormButton 
        title={isLoading ? "Loading..." : "Register"} 
        onPress={register} 
      />
      
      <View style={{ height: 10 }} />
      
      <FormButton 
        title={isLoading ? "Loading..." : "Login"} 
        onPress={login} 
      />

      {isLoading && <ActivityIndicator style={{marginTop: 10}} size="small" color="#055c49" />}
      
      <Text style={styles.messageText}>{message}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06d3a7',
    padding: 20,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06d3a7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#055c49',
    marginBottom: 10,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#055c49',
    marginBottom: 30,
  },
  tokenText: {
    fontSize: 12,
    color: '#055c49',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  qrImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginVertical: 10,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#055c49',
    marginTop: 10,
  },
  expiryText: {
    fontSize: 14,
    color: '#055c49',
    marginTop: 5,
  },
  messageText: {
    marginTop: 15,
    color: '#055c49',
    textAlign: 'center',
  },
});
