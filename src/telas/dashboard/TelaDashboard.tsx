import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, StatusBar, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, GRADIENTE_CABECALHO } from '@/utilitarios/constantes';
import { formatarMoeda } from '@/utilitarios/formatadores';
import { useDashboard } from '@/hooks/useDashboard';
import SeletorMes from '@/componentes/comuns/SeletorMes';
import ResumoEntradaSaida from '@/componentes/dashboard/ResumoEntradaSaida';
import PesoCartoes from '@/componentes/dashboard/PesoCartoes';
import SaldoTransitado from '@/componentes/dashboard/SaldoTransitado';
import GraficoCategorias from '@/componentes/dashboard/GraficoCategorias';

export default function TelaDashboard() {
  const insets = useSafeAreaInsets();
  const navegacao = useNavigation<NavigationProp<any>>();
  const { resumo, saldoTransitado, gastosPorCategoria, carregando } = useDashboard();

  const saldoFinal = resumo
    ? resumo.totalEntradas - resumo.totalSaidas + saldoTransitado
    : 0;

  if (carregando) {
    return (
      <View style={estilos.carregandoContainer}>
        <ActivityIndicator size="large" color={CORES.primaria} />
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        style={estilos.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com Gradiente */}
        <LinearGradient
          colors={[...GRADIENTE_CABECALHO]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[estilos.cabecalhoGradiente, { paddingTop: insets.top + 16 }]}
        >
          <View style={estilos.cabecalhoTopo}>
            <View style={estilos.cabecalhoLogoArea}>
              <View style={estilos.logoContainer}>
                <Image
                  source={require('../../../assets/logo-pp.png')}
                  style={estilos.logoImagem}
                />
              </View>
              <View>
                <Text style={estilos.cabecalhoSaudacao}>Bem-vindo!</Text>
                <Text style={estilos.cabecalhoNome}>Baita Gestão Financeira</Text>
              </View>
            </View>
            <TouchableOpacity
              style={estilos.iconeCabecalho}
              onPress={() => navegacao.navigate('TelaConfiguracoes' as any)}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Saldo Total */}
          <View style={estilos.saldoContainer}>
            <Text style={estilos.saldoLabel}>Saldo Total</Text>
            <Text style={estilos.saldoValor}>{formatarMoeda(saldoFinal)}</Text>
          </View>

          {/* Seletor de Mes no header */}
          <SeletorMes variante="claro" />

          {/* Acoes Rapidas */}
          <View style={estilos.acoesRapidas}>
            <TouchableOpacity
              style={estilos.acaoItem}
              onPress={() => navegacao.navigate('AbaEntradas' as any, { screen: 'TelaFormEntrada' })}
              activeOpacity={0.7}
            >
              <View style={estilos.acaoIcone}>
                <Ionicons name="arrow-up" size={20} color={CORES.primaria} />
              </View>
              <Text style={estilos.acaoTexto}>Entrada</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={estilos.acaoItem}
              onPress={() => navegacao.navigate('AbaSaidas' as any, { screen: 'TelaFormSaida' })}
              activeOpacity={0.7}
            >
              <View style={estilos.acaoIcone}>
                <Ionicons name="arrow-down" size={20} color={CORES.saidaCor} />
              </View>
              <Text style={estilos.acaoTexto}>Saida</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={estilos.acaoItem}
              onPress={() => navegacao.navigate('AbaCartoes' as any)}
              activeOpacity={0.7}
            >
              <View style={estilos.acaoIcone}>
                <Ionicons name="card" size={20} color={CORES.primaria} />
              </View>
              <Text style={estilos.acaoTexto}>Cartoes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={estilos.acaoItem}
              onPress={() => navegacao.navigate('AbaMais' as any)}
              activeOpacity={0.7}
            >
              <View style={estilos.acaoIcone}>
                <Ionicons name="wallet" size={20} color={CORES.secundaria} />
              </View>
              <Text style={estilos.acaoTexto}>Cofrinhos</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Corpo Branco */}
        <View style={estilos.corpo}>
          {/* Cards de Entradas e Saidas com Gradiente */}
          <ResumoEntradaSaida
            totalEntradas={resumo?.totalEntradas ?? 0}
            totalSaidas={resumo?.totalSaidas ?? 0}
          />

          <PesoCartoes totalFaturas={resumo?.totalFaturas ?? 0} />

          <SaldoTransitado valor={saldoTransitado} />

          <GraficoCategorias dados={gastosPorCategoria} />
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  scroll: {
    flex: 1,
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CORES.fundo,
  },
  cabecalhoGradiente: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  cabecalhoLogoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  logoImagem: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  cabecalhoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cabecalhoSaudacao: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
  },
  cabecalhoNome: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 2,
  },
  iconeCabecalho: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saldoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  saldoLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  saldoValor: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  acoesRapidas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  acaoItem: {
    alignItems: 'center',
    gap: 6,
  },
  acaoIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  acaoTexto: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  corpo: {
    padding: 20,
    gap: 16,
    marginTop: -8,
  },
});
