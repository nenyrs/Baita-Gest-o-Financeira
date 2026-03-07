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
import { CORES, GRADIENTE_CABECALHO, METODOS_PAGAMENTO } from '@/utilitarios/constantes';
import { formatarMoeda, formatarData } from '@/utilitarios/formatadores';
import { AbaSaidasParams } from '@/tipos/Navegacao';
import { useSaidas } from '@/hooks/useSaidas';
import { useCategorias } from '@/hooks/useCategorias';
import { Saida } from '@/tipos/Saida';

type NavegacaoSaidas = NativeStackNavigationProp<AbaSaidasParams>;

export default function TelaListaSaidas() {
  const navegacao = useNavigation<NavegacaoSaidas>();
  const insets = useSafeAreaInsets();
  const { saidas, carregando, excluir } = useSaidas();
  const { categorias } = useCategorias();

  function obterNomeCategoria(categoriaId: number | null): string {
    if (!categoriaId) return '';
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nome : '';
  }

  function obterLabelMetodo(valor: string): string {
    const metodo = METODOS_PAGAMENTO.find((m) => m.valor === valor);
    return metodo ? metodo.label : valor;
  }

  function confirmarExclusao(id: number) {
    Alert.alert(
      'Excluir Saida',
      'Tem certeza que deseja excluir esta saida?',
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

  function renderizarItem({ item }: { item: Saida }) {
    const nomeCategoria = obterNomeCategoria(item.categoria_id);
    const labelMetodo = obterLabelMetodo(item.metodo_pagamento);

    return (
      <TouchableOpacity
        onPress={() => navegacao.navigate('TelaFormSaida', { id: item.id })}
        onLongPress={() => confirmarExclusao(item.id)}
        style={estilos.itemContainer}
      >
        <View style={estilos.itemIconeContainer}>
          <View style={estilos.itemIcone}>
            <Ionicons name="arrow-down" size={18} color={CORES.saidaCor} />
          </View>
        </View>
        <View style={estilos.itemInfo}>
          <Text style={estilos.itemTitulo}>{item.titulo}</Text>
          <View style={estilos.itemDetalhes}>
            <Text style={estilos.itemData}>{formatarData(item.data)}</Text>
            {nomeCategoria ? (
              <Text style={estilos.itemCategoria}>{nomeCategoria}</Text>
            ) : null}
          </View>
          <View style={estilos.itemMetodoContainer}>
            <View style={estilos.badgeMetodo}>
              <Text style={estilos.textoMetodo}>{labelMetodo}</Text>
            </View>
            {item.metodo_pagamento === 'credito' && item.total_parcelas > 0 && (
              <Text style={estilos.textoParcelas}>
                {item.total_parcelas}x
              </Text>
            )}
          </View>
        </View>
        <View style={estilos.itemDireita}>
          <Text style={estilos.itemValor}>{formatarMoeda(item.valor)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function renderizarVazio() {
    return (
      <View style={estilos.listaVazia}>
        <View style={estilos.vazioIcone}>
          <Ionicons name="cash-outline" size={40} color={CORES.saidaCor} />
        </View>
        <Text style={estilos.textoVazio}>Nenhuma saida cadastrada</Text>
        <Text style={estilos.textoVazioSub}>Toque no + para adicionar</Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      {/* Header Gradiente */}
      <LinearGradient
        colors={[...GRADIENTE_CABECALHO]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[estilos.cabecalho, { paddingTop: insets.top + 12 }]}
      >
        <View style={estilos.cabecalhoConteudo}>
          <Text style={estilos.titulo}>Saidas</Text>
          <TouchableOpacity
            style={estilos.botaoContasFixas}
            onPress={() => navegacao.navigate('TelaContasFixas')}
          >
            <Ionicons name="repeat-outline" size={18} color="#FFFFFF" />
            <Text style={estilos.textoContasFixas}>Contas Fixas</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {carregando ? (
        <View style={estilos.carregando}>
          <ActivityIndicator size="large" color={CORES.primaria} />
        </View>
      ) : (
        <FlatList
          data={saidas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderizarItem}
          ListEmptyComponent={renderizarVazio}
          contentContainerStyle={saidas.length === 0 ? estilos.listaVaziaContainer : estilos.listaConteudo}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={estilos.botaoAdicionar}
        onPress={() => navegacao.navigate('TelaFormSaida')}
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
  cabecalhoConteudo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  botaoContasFixas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  textoContasFixas: {
    fontSize: 13,
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(239,83,80,0.1)',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemIconeContainer: {
    marginRight: 12,
  },
  itemIcone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(239,83,80,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 4,
  },
  itemDetalhes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  itemData: {
    fontSize: 12,
    color: CORES.textoSecundario,
  },
  itemCategoria: {
    fontSize: 12,
    color: CORES.primaria,
    fontWeight: '500',
  },
  itemMetodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeMetodo: {
    backgroundColor: CORES.fundo,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  textoMetodo: {
    fontSize: 11,
    color: CORES.textoSecundario,
    fontWeight: '600',
  },
  textoParcelas: {
    fontSize: 11,
    color: CORES.textoSecundario,
    fontWeight: '500',
  },
  itemDireita: {
    alignItems: 'flex-end',
  },
  itemValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CORES.saidaCor,
  },
  botaoAdicionar: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CORES.saidaCor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: CORES.saidaCor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
