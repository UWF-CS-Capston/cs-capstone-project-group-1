import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

interface MachineViewProps {
    title: string;
    queue: number;
    position?: number | null;
    isUsing: boolean;
    isJoined: boolean;
    isLoading: boolean;
    onJoin: () => void;
    onLeave: () => void;
    onPress?: () => void;
}

export default function MachineView({
    title,
    queue,
    position,
    isUsing,
    isJoined,
    isLoading,
    onJoin,
    onLeave,
    onPress,
}: MachineViewProps) {
    const actionLabel = isJoined ? 'Leave Queue' : 'Join Queue';

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.descriptionText}>Queue: {queue}</Text>
            {isUsing ? (
                <Text style={styles.descriptionText}>You are using this machine</Text>
            ) : position ? (
                <Text style={styles.descriptionText}>Your position: #{position}</Text>
            ) : (
                <Text style={styles.descriptionText}>No active queue spot yet</Text>
            )}
            <View style={styles.buttonRow}>
                <Pressable
                    onPress={isJoined ? onLeave : onJoin}
                    style={[
                        styles.button,
                        isJoined ? styles.leaveButton : styles.joinButton
                    ]}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Working...' : actionLabel}
                    </Text>
                </Pressable>
                <Pressable onPress={onPress} style={styles.button} disabled={isLoading}>
                    <Text style={styles.buttonText}>View</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        
        justifyContent: 'space-around',
        width: 210,
        minHeight: 230,
        backgroundColor: '#ffffff',
        margin: 10,
        borderColor: '#009e6c',
        borderWidth: 3,
        borderRadius: 5,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 20,
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 7 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    joinButton: {
        backgroundColor: '#0ee0b1', // green 
        borderColor: '#0ee0b1',
        borderWidth: 3,
        borderRadius: 5,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    leaveButton: {
        backgroundColor: '#e74c3c', // red
        borderColor: '#111111',
        borderWidth: 3,
        borderRadius: 5,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#09eba3',
        borderRadius: 15,
        backgroundColor: '#09eba3',
        marginTop: 8,
    },
    actionButton: {
        backgroundColor: '#0ee0b1',
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
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#009e6c',
        paddingBottom: 4,
    },
    descriptionText: {
        color: '#055c49',
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
    },
});
