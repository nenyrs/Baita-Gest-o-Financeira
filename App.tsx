import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProvedorBancoDados, useBancoDados } from '@/contextos/ContextoBancoDados';
import { ProvedorMesSelecionado } from '@/contextos/ContextoMesSelecionado';
import NavegacaoPrincipal from '@/navegacao/NavegacaoPrincipal';
import FundoApp from '@/componentes/comuns/FundoApp';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { CORES } from '@/utilitarios/constantes';

function AppConteudo() {
  const { carregando, erro } = useBancoDados();

  if (carregando) {
    return (
      <FundoApp>
        <View style={estilos.carregando}>
          <ActivityIndicator size="large" color={CORES.primaria} />
          <Text style={estilos.textoCarregando}>Carregando...</Text>
        </View>
      </FundoApp>
    );
  }

  if (erro) {
    return (
      <FundoApp>
        <View style={estilos.carregando}>
          <Text style={estilos.textoErro}>Erro ao inicializar: {erro}</Text>
        </View>
      </FundoApp>
    );
  }

  return (
    <FundoApp>
      <NavigationContainer>
        <ProvedorMesSelecionado>
          <NavegacaoPrincipal />
        </ProvedorMesSelecionado>
        <StatusBar style="light" />
      </NavigationContainer>
    </FundoApp>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ProvedorBancoDados>
        <AppConteudo />
      </ProvedorBancoDados>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCarregando: {
    marginTop: 12,
    fontSize: 16,
    color: CORES.textoSecundario,
  },
  textoErro: {
    fontSize: 16,
    color: CORES.erro,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
