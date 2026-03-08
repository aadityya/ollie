import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/src/theme';
import { AppIcons, IconComponent } from '@/src/constants/icons';

interface TabIconProps {
  icon: IconComponent;
  focused: boolean;
  activeBg: string;
}

function TabIcon({ icon: Icon, focused, activeBg }: TabIconProps) {
  return (
    <View style={[styles.tabIcon, focused && { backgroundColor: activeBg }]}>
      <Icon width={108} height={108} style={{ opacity: focused ? 1 : 0.45 }} />
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
          height: 148,
          paddingBottom: 26,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={AppIcons.home}
              focused={focused}
              activeBg={ollie.bgSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen name="log" options={{ href: null }} />
      <Tabs.Screen
        name="timeline"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={AppIcons.log}
              focused={focused}
              activeBg={ollie.bgSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={AppIcons.insights}
              focused={focused}
              activeBg={ollie.bgSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={AppIcons.more}
              focused={focused}
              activeBg={ollie.bgSecondary}
            />
          ),
        }}
      />
      {/* Hidden tabs */}
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="milestones" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 108,
    height: 108,
    borderRadius: 24,
  },
});
