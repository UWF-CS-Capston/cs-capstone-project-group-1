import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

interface MachineViewProps {
    title: string;
    image: any; // replace with actual image type
    queue: number;
    position?: number; // optional, only show if user is in queue
    joined: boolean; // whether the user has joined the queue
    isLoading: boolean; // whether a join/leave action is in progress
    onJoin: () => void; // function to call when joining queue
    onLeave: () => void; // function to call when leaving queue
    onPress?: () => void;
}

export default function MachineView({title, image, queue, position, joined, isLoading, onJoin, onLeave, onPress} : MachineViewProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.descriptionText}>Queue: {queue}</Text>
            {position !== undefined && (
                <Text style={styles.descriptionText}>Your position: #{position}</Text>
            )}
            <Pressable onPress={onPress} style={styles.button}>
                <Text style={styles.buttonText}>View</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignContent: 'space-around',
        width: '25%',
        backgroundColor: '#06b690',
        margin: 10,
        borderColor: '#09eba3',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 7},
        shadowOpacity: .25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    button: {
        width: 100,
        padding: 10,
        borderWidth: 1,
        borderColor: '#09eba3',
        borderRadius: 15,
        backgroundColor: '#09eba3',
        margin: 10,
    },
    buttonText: {
        color: '#055c49',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    titleText: {
        color: '#055c49',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 20,
    },
    descriptionText: {
        color: '#055c49',
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '500',
    }
})