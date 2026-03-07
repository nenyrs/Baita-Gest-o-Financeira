import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PilhaDashboard from './PilhaDashboard';
import PilhaEntradas from './PilhaEntradas';
import PilhaSaidas from './PilhaSaidas';
import PilhaCartoes from './PilhaCartoes';
import PilhaMais from './PilhaMais';
import { TabParams } from '@/tipos/Navegacao';
import { CORES } from '@/utilitarios/constantes';

const Tab = createBottomTabNavigator<TabParams>();

function BotaoCentralVazio() {
  return <View />;
}

export default function NavegacaoPrincipal() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: CORES.primaria,
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          height: 64 + (insets.bottom > 0 ? insets.bottom : 8),
          elevation: 20,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="AbaDashboard"
        component={PilhaDashboard}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AbaEntradas"
        component={PilhaEntradas}
        options={{
          tabBarLabel: 'Entradas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'arrow-up-circle' : 'arrow-up-circle-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AbaSaidas"
        component={PilhaSaidas}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <View style={estilos.botaoCentralWrapper}>
              <TouchableOpacity
                style={estilos.botaoCentral}
                onPress={props.onPress as any}
                activeOpacity={0.85}
              >
                <View style={estilos.botaoCentralInner}>
                  <Ionicons name="swap-vertical" size={28} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AbaCartoes"
        component={PilhaCartoes}
        options={{
          tabBarLabel: 'Cartoes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'card' : 'card-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AbaMais"
        component={PilhaMais}
        options={{
          tabBarLabel: 'Mais',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  botaoCentralWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 70,
    top: -20,
  },
  botaoCentral: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CORES.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: CORES.primaria,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  botaoCentralInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
