import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaCofrinhos from '@/telas/cofrinhos/TelaListaCofrinhos';
import TelaFormCofrinho from '@/telas/cofrinhos/TelaFormCofrinho';
import TelaRelatorioMensal from '@/telas/relatorios/TelaRelatorioMensal';
import TelaRelatorioAnual from '@/telas/relatorios/TelaRelatorioAnual';
import { AbaMaisParams } from '@/tipos/Navegacao';

const Pilha = createNativeStackNavigator<AbaMaisParams>();

export default function PilhaMais() {
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
        name="TelaListaCofrinhos"
        component={TelaListaCofrinhos}
        options={{ headerShown: false }}
      />
      <Pilha.Screen
        name="TelaFormCofrinho"
        component={TelaFormCofrinho}
        options={{ title: 'Novo Cofrinho' }}
      />
      <Pilha.Screen
        name="TelaRelatorioMensal"
        component={TelaRelatorioMensal}
        options={{ title: 'Relatorio Mensal' }}
      />
      <Pilha.Screen
        name="TelaRelatorioAnual"
        component={TelaRelatorioAnual}
        options={{ title: 'Relatorio Anual' }}
      />
    </Pilha.Navigator>
  );
}
