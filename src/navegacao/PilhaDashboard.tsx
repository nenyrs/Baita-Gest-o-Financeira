import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaDashboard from '@/telas/dashboard/TelaDashboard';
import TelaConfiguracoes from '@/telas/configuracoes/TelaConfiguracoes';
import { AbaDashboardParams } from '@/tipos/Navegacao';

const Pilha = createNativeStackNavigator<AbaDashboardParams>();

export default function PilhaDashboard() {
  return (
    <Pilha.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Pilha.Screen
        name="TelaDashboard"
        component={TelaDashboard}
      />
      <Pilha.Screen
        name="TelaConfiguracoes"
        component={TelaConfiguracoes}
      />
    </Pilha.Navigator>
  );
}
