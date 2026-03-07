import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CORES, GRADIENTE_CABECALHO } from '@/utilitarios/constantes';
import { formatarMoeda, formatarPorcentagem } from '@/utilitarios/formatadores';
import { AbaMaisParams } from '@/tipos/Navegacao';
import { useCofrinhos } from '@/hooks/useCofrinhos';
import { Cofrinho } from '@/tipos/Cofrinho';

type NavegacaoMais = NativeStackNavigationProp<AbaMaisParams>;

export default function TelaListaCofrinhos() {
  const navegacao = useNavigation<NavegacaoMais>();
  const insets = useSafeAreaInsets();
  const { cofrinhos, carregando, excluir } = useCofrinhos();

  function confirmarExclusao(id: number) {
    Alert.alert(
      'Excluir Cofrinho',
      'Tem certeza que deseja excluir este cofrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluir(id),
        },
      ]
    );
  }

  function renderizarItem({ item }: { item: Cofrinho }) {
    return (
      <TouchableOpacity
        onPress={() => navegacao.navigate('TelaFormCofrinho', { id: item.id })}
        onLongPress={() => confirmarExclusao(item.id)}
        style={estilos.itemContainer}
      >
        <View style={estilos.itemCabecalho}>
          <View style={estilos.itemIcone}>
            <Ionicons name="wallet" size={20} color={CORES.secundaria} />
          </View>
          <View style={estilos.itemCabecalhoInfo}>
            <Text style={estilos.itemNome}>{item.nome}</Text>
            {item.banco && (
              <Text style={estilos.itemBanco}>{item.banco}</Text>
            )}
          </View>
        </View>
        <View style={estilos.itemDetalhes}>
          <View style={estilos.itemDetalheBox}>
            <Text style={estilos.itemDetalheRotulo}>Valor Alocado</Text>
            <Text style={estilos.itemDetalheValor}>
              {formatarMoeda(item.valor_alocado)}
            </Text>
          </View>
          <View style={estilos.itemDetalheBox}>
            <Text style={estilos.itemDetalheRotulo}>Rentabilidade</Text>
            <Text style={[estilos.itemDetalheValor, { color: CORES.sucesso }]}>
              {formatarPorcentagem(item.rentabilidade)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderizarVazio() {
    return (
      <View style={estilos.listaVazia}>
        <View style={estilos.vazioIcone}>
          <Ionicons name="wallet-outline" size={40} color={CORES.secundaria} />
        </View>
        <Text style={estilos.textoVazio}>Nenhum cofrinho cadastrado</Text>
        <Text style={estilos.textoVazioSub}>Toque no + para adicionar</Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <LinearGradient
        colors={[...GRADIENTE_CABECALHO]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[estilos.cabecalho, { paddingTop: insets.top + 12 }]}
      >
        <Text style={estilos.titulo}>Cofrinhos & Investimentos</Text>
      </LinearGradient>

      <View style={estilos.botoesRelatorios}>
        <TouchableOpacity
          style={estilos.botaoRelatorio}
          onPress={() => navegacao.navigate('TelaRelatorioMensal')}
        >
          <View style={estilos.relatorioIcone}>
            <Ionicons name="bar-chart-outline" size={18} color={CORES.primaria} />
          </View>
          <Text style={estilos.textoBotaoRelatorio}>Relatorio Mensal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.botaoRelatorio}
          onPress={() => navegacao.navigate('TelaRelatorioAnual')}
        >
          <View style={estilos.relatorioIcone}>
            <Ionicons name="stats-chart-outline" size={18} color={CORES.primaria} />
          </View>
          <Text style={estilos.textoBotaoRelatorio}>Relatorio Anual</Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={estilos.carregando}>
          <ActivityIndicator size="large" color={CORES.primaria} />
        </View>
      ) : (
        <FlatList
          data={cofrinhos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderizarItem}
          ListEmptyComponent={renderizarVazio}
          contentContainerStyle={cofrinhos.length === 0 ? estilos.listaVaziaContainer : estilos.listaConteudo}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={estilos.botaoAdicionar}
        onPress={() => navegacao.navigate('TelaFormCofrinho')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  cabecalho: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  botoesRelatorios: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  botaoRelatorio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  relatorioIcone: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(33,150,243,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoRelatorio: {
    fontSize: 13,
    color: CORES.texto,
    fontWeight: '600',
  },
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listaConteudo: {
    padding: 16,
    paddingBottom: 120,
  },
  listaVaziaContainer: {
    flex: 1,
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazioIcone: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(38,166,154,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textoVazio: {
    fontSize: 17,
    color: CORES.texto,
    fontWeight: '600',
  },
  textoVazioSub: {
    fontSize: 14,
    color: CORES.textoSecundario,
    marginTop: 4,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  itemCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  itemIcone: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(38,166,154,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCabecalhoInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  itemBanco: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  itemDetalhes: {
    flexDirection: 'row',
    gap: 12,
  },
  itemDetalheBox: {
    flex: 1,
    backgroundColor: CORES.fundo,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  itemDetalheRotulo: {
    fontSize: 11,
    color: CORES.textoSecundario,
    marginBottom: 4,
  },
  itemDetalheValor: {
    fontSize: 15,
    fontWeight: '700',
    color: CORES.texto,
  },
  botaoAdicionar: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CORES.secundaria,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: CORES.secundaria,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
