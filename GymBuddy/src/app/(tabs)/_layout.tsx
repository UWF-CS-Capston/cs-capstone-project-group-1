import { Tabs, useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { Text, View, TouchableOpacity } from 'react-native';

export default function RootLayout() {
    const { role, isLoading, token } = useAuth();
    const router = useRouter();
    
    // Debug: log the role to see what it is
    console.log('Current role:', role);
    console.log('Is authenticated:', !!token);
    
    const isStaff = role === 'staff' || role === 'admin';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#08ffb1',
                tabBarInactiveTintColor: '#ececec',
                tabBarStyle: { backgroundColor: '#02ac87' },
                tabBarPosition: 'bottom',
                tabBarHideOnKeyboard: true,
                tabBarAllowFontScaling: true,
            }}
        >
            <Tabs.Screen name="index" options={{
                title: "Home",
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={size} color={color} />
                ),     
            }} />
            
            <Tabs.Screen name="scan" options={{ 
                title: "Scan",
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'qr-code-sharp' : 'qr-code-outline'} size={size} color={color} />
                ),     
            }} />
            
            <Tabs.Screen name="account" options={{ 
                title: "Account", 
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'person-sharp' : 'person-outline'} size={size} color={color} />
                ),
                tabBarButton: (props) => {
                    const {
                        onPress,
                        onLongPress,
                        onLayout,
                        onBlur,
                        onFocus,
                        delayLongPress,
                        disabled,
                        accessibilityLabel,
                        accessibilityRole,
                        accessibilityState,
                        testID,
                        style,
                        children,
                    } = props;

                    return (
                        <TouchableOpacity
                            accessibilityLabel={accessibilityLabel}
                            accessibilityRole={accessibilityRole}
                            accessibilityState={accessibilityState}
                            testID={testID}
                            style={style}
                            onLongPress={onLongPress ?? undefined}
                            onLayout={onLayout}
                            onBlur={onBlur ?? undefined}
                            onFocus={onFocus ?? undefined}
                            delayLongPress={delayLongPress ?? undefined}
                            disabled={disabled ?? undefined}
                            onPress={(e) => {
                                // Don't redirect while auth is still loading
                                if (isLoading) {
                                    return;
                                }
                                
                                if (!token) {
                                    // If not authenticated, go directly to login form
                                    router.push('/account/loginForm');
                                } else {
                                    // If authenticated, use default navigation
                                    onPress?.(e);
                                }
                            }}
                        >
                            {children}
                        </TouchableOpacity>
                    );
                }
            }} />
            
            {/* <Tabs.Screen name="employee" options={{
                title: "Employee",
                tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'briefcase-sharp' : 'briefcase-outline'} size={size} color={color} />
                ),
                tabBarButton: (props) => {
                    if (!isStaff) {
                        return null; // Hide the tab if the user is not staff
                    }

                    const {
                        onPress,
                        onLongPress,
                        onLayout,
                        onBlur,
                        onFocus,
                        delayLongPress,
                        disabled,
                        accessibilityLabel,
                        accessibilityRole,
                        accessibilityState,
                        testID,
                        style,
                        children,
                    } = props;

                    return (
                        <TouchableOpacity
                            accessibilityLabel={accessibilityLabel}
                            accessibilityRole={accessibilityRole}
                            accessibilityState={accessibilityState}
                            testID={testID}
                            style={style}
                            onPress={onPress}
                            onLongPress={onLongPress ?? undefined}
                            onLayout={onLayout}
                            onBlur={onBlur ?? undefined}
                            onFocus={onFocus ?? undefined}
                            delayLongPress={delayLongPress ?? undefined}
                            disabled={disabled ?? undefined}
                        >
                            {children}
                        </TouchableOpacity>
                    );
                }
            }} />  */}
        </Tabs>
    );
}