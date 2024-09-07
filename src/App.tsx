import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { client } from './api/services.gen';
import LoginScreen from './LoginScreen';
import AnagraficaPage from './screens/AnagraficaPage/AnagraficaPage';
import PersonaDetailsPage from './screens/AnagraficaPage/PersonaDetailsPage';
import EventiPage from './screens/EventiPage/EventiPage';
import ProfiloPage from './screens/ProfiloPage/ProfiloPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
client.setConfig({
  baseUrl: 'https://api.cngei.it',
});

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Anagrafica" 
        component={AnagraficaPage} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Eventi" 
        component={EventiPage} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profilo" 
        component={ProfiloPage} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const interceptor = useCallback((response: Response) => {
    if (response.status === 401) {
      setIsLoggedIn(false)
    }
    return response
  }, [])

  useEffect(() => {
    client.interceptors.response.use(interceptor)
    return () => {
      client.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <PaperProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isLoggedIn ? (
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                initialParams={{ setIsLoggedIn }}
              />
            ) : (
              <>
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen 
                  name="PersonaDetails" 
                  component={PersonaDetailsPage} 
                  options={props => ({ 
                    headerShown: true, 
                    title: props.route.params.fullName 
                  })} 
                />
              </>
            )}
          </Stack.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
