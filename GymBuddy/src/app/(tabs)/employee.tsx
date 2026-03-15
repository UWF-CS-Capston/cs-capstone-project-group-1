import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import MainView from '../../components/views/mainView';

// Mock machine data
const machines = [
  { id: '1', name: 'Treadmill', status: 'In Use', queue: 2 },
  { id: '2', name: 'Leg Press', status: 'Available', queue: 0 },
  { id: '3', name: 'Chest Fly', status: 'In Use', queue: 1 },
  { id: '4', name: 'Squat Rack', status: 'Maintenance', queue: 0 },
  { id: '5', name: 'Bench Press', status: 'Available', queue: 0 },
];

export default function EmployeeScreen() {
  const occupancy = 42; // static number for now

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return '#4CAF50'; // Green
      case 'In Use':
        return '#FF9800'; // Orange
      case 'Maintenance':
        return '#F44336'; // Red
      default:
        return '#055c49'; // Default dark green
    }
  };

  const renderMachine = ({ item }: { item: typeof machines[0] }) => (
    <View style={styles.machineCard}>
      <Text style={styles.machineName}>{item.name}</Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
      <Text style={styles.queue}>Queue: {item.queue}</Text>
    </View>
  );

  return (
    <MainView>
      <View style={styles.header}>
        <Text style={styles.title}>Employee Dashboard</Text>
        <Text style={styles.occupancy}>Current Occupancy: {occupancy}</Text>
      </View>
      <FlatList
        data={machines}
        keyExtractor={(item) => item.id}
        renderItem={renderMachine}
        contentContainerStyle={styles.list}
      />
    </MainView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#055c49',
  },
  occupancy: {
    fontSize: 18,
    marginTop: 5,
    color: '#055c49',
  },
  list: {
    paddingBottom: 20,
    width: '100%',
  },
  machineCard: {
    backgroundColor: '#09eba3',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  machineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#055c49', // Dark green text
    flex: 2,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  queue: {
    fontSize: 14,
    color: '#055c49', // Dark green text
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
});