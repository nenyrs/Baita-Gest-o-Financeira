import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaEntradas from '@/telas/entradas/TelaListaEntradas';
import TelaFormEntrada from '@/telas/entradas/TelaFormEntrada';
import TelaTemplatesEntrada from '@/telas/entradas/TelaTemplatesEntrada';
import { AbaEntradasParams } from '@/tipos/Navegacao';

const Pilha = createNativeStackNavigator<AbaEntradasParams>();

export default function PilhaEntradas() {
  return (
    <Pilha.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#1A1A2E',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Pilha.Screen
        name="TelaListaEntradas"
        component={TelaListaEntradas}
        options={{ headerShown: false }}
      />
      <Pilha.Screen
        name="TelaFormEntrada"
        component={TelaFormEntrada}
        options={{ title: 'Nova Entrada' }}
      />
      <Pilha.Screen
        name="TelaTemplatesEntrada"
        component={TelaTemplatesEntrada}
        options={{ title: 'Templates' }}
      />
    </Pilha.Navigator>
  );
}
