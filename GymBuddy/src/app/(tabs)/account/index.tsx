import { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import MainView from '../../../components/views/mainView';
import { router } from 'expo-router';
import NavButton from '../../../components/buttons/navButton';
import { apiFetch } from '../../../utils/api';

interface UserInfo {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

export default function Index() {
  const { token, logout } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!token) {
      router.push('/account/loginForm');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await apiFetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.user);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [token]);
  
  if (!token || isLoading) {
    return (
      <MainView>
        <ActivityIndicator size="large" color="#055c49" />
      </MainView>
    );
  }
  
  return (
    <MainView>
      <View style={{ alignItems: 'center', marginTop: 40, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#055c49', marginBottom: 10 }}>
          Welcome back!
        </Text>
        
        <Text style={{ fontSize: 18, color: '#055c49', marginBottom: 5 }}>
          {userInfo?.email || 'GymBuddy User'}
        </Text>
        
        <Text style={{ fontSize: 14, color: '#055c49', marginBottom: 30, opacity: 0.7 }}>
          Member since: {userInfo?.created_at ? new Date(userInfo.created_at).toLocaleDateString() : 'Today'}
        </Text>
        
        <NavButton title="Logout" onPress={logout} />
      </View>
    </MainView>
  );
}