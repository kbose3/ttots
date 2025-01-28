import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5C6BC0', // Active tab color
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
        name="market"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" size={24} color={color} />,
        }}
      />

      {/* Upload Tab */}
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <FontAwesome name="cloud-upload" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
