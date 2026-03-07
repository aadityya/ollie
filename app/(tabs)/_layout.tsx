import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/src/theme';

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
}

function TabIcon({ icon, label, focused, activeColor, inactiveColor }: TabIconProps) {
  const color = focused ? activeColor : inactiveColor;
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.icon, { color }]}>{icon}</Text>
      <Text style={[styles.label, { color, fontFamily: 'Nunito_600SemiBold' }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { ollie } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: ollie.navBg,
          borderTopColor: ollie.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 28,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="🏠"
              label="Home"
              focused={focused}
              activeColor={ollie.navActive}
              inactiveColor={ollie.navInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="➕"
              label="Log"
              focused={focused}
              activeColor={ollie.navActive}
              inactiveColor={ollie.navInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="📋"
              label="Timeline"
              focused={focused}
              activeColor={ollie.navActive}
              inactiveColor={ollie.navInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="milestones"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="⭐"
              label="Milestones"
              focused={focused}
              activeColor={ollie.navActive}
              inactiveColor={ollie.navInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="⚙️"
              label="Settings"
              focused={focused}
              activeColor={ollie.navActive}
              inactiveColor={ollie.navInactive}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 22,
    lineHeight: 26,
  },
  label: {
    fontSize: 10,
  },
});
