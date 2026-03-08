import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet, View, Image, ImageSourcePropType } from 'react-native';
import { useAppTheme } from '@/src/theme';
import { AppIcons } from '@/src/constants/icons';

interface TabIconProps {
  icon: string | ImageSourcePropType;
  label: string;
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
}

function TabIcon({ icon, label, focused, activeColor, inactiveColor }: TabIconProps) {
  const color = focused ? activeColor : inactiveColor;
  return (
    <View style={styles.tabIcon}>
      {typeof icon === 'string' ? (
        <Text style={[styles.emojiIcon, { color }]}>{icon}</Text>
      ) : (
        <Image source={icon} style={[styles.imgIcon, { opacity: focused ? 1 : 0.5 }]} resizeMode="contain" />
      )}
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
              icon={AppIcons.log}
              label="Timeline"
              focused={focused}
              activeColor={ollie.navActive}
              inactiveColor={ollie.navInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={AppIcons.milestones}
              label="Insights"
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
              icon={AppIcons.settings}
              label="Settings"
              focused={focused}
              activeColor={ollie.navActive}
              inactiveColor={ollie.navInactive}
            />
          ),
        }}
      />
      {/* Hide milestones tab but keep the file */}
      <Tabs.Screen
        name="milestones"
        options={{
          href: null,
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
  emojiIcon: {
    fontSize: 22,
    lineHeight: 26,
  },
  imgIcon: {
    width: 26,
    height: 26,
  },
  label: {
    fontSize: 10,
  },
});
