import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F4A300', // Active tab color
        tabBarInactiveTintColor: '#333', // Inactive tab color
        headerShown: false, // Disable headers
      }}
    >
      {/* Sign Out Tab */}
      <Tabs.Screen
        name="index" // Maps to (tabs)/index.tsx
        options={{
          title: 'Sign Out',
          tabBarIcon: ({ color }) => <FontAwesome name="sign-out" size={24} color={color} />,
        }}
      />

      {/* Market Tab */}
      <Tabs.Screen
        name="market/index"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" size={24} color={color} />,
        }}
      />

      {/* Upload Tab */}
      <Tabs.Screen
        name="upload/index"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <FontAwesome name="cloud-upload" size={24} color={color} />,
        }}
      />

      {/* Drivers Tab */}
      <Tabs.Screen
        name="drivers/index"
        options={{
          title: 'Drivers',
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}