import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Platform, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Hey" onPress={ () => {
        if (Platform.OS === 'web'){
          window.alert("Hello World")
        }
        else {
          Alert.alert("Hello World")
        }
      }}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
