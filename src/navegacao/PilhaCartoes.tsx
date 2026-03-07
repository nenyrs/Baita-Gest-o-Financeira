import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaCartoes from '@/telas/cartoes/TelaListaCartoes';
import TelaFormCartao from '@/telas/cartoes/TelaFormCartao';
import TelaFaturaCartao from '@/telas/cartoes/TelaFaturaCartao';
import { AbaCartoesParams } from '@/tipos/Navegacao';

const Pilha = createNativeStackNavigator<AbaCartoesParams>();

export default function PilhaCartoes() {
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
        name="TelaListaCartoes"
        component={TelaListaCartoes}
        options={{ headerShown: false }}
      />
      <Pilha.Screen
        name="TelaFormCartao"
        component={TelaFormCartao}
        options={{ title: 'Novo Cartao' }}
      />
      <Pilha.Screen
        name="TelaFaturaCartao"
        component={TelaFaturaCartao}
        options={{ title: 'Fatura' }}
      />
    </Pilha.Navigator>
  );
}
