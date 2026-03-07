import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaSaidas from '@/telas/saidas/TelaListaSaidas';
import TelaFormSaida from '@/telas/saidas/TelaFormSaida';
import TelaContasFixas from '@/telas/saidas/TelaContasFixas';
import { AbaSaidasParams } from '@/tipos/Navegacao';

const Pilha = createNativeStackNavigator<AbaSaidasParams>();

export default function PilhaSaidas() {
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
        name="TelaListaSaidas"
        component={TelaListaSaidas}
        options={{ headerShown: false }}
      />
      <Pilha.Screen
        name="TelaFormSaida"
        component={TelaFormSaida}
        options={{ title: 'Nova Saida' }}
      />
      <Pilha.Screen
        name="TelaContasFixas"
        component={TelaContasFixas}
        options={{ title: 'Contas Fixas' }}
      />
    </Pilha.Navigator>
  );
}
