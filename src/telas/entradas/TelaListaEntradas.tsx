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
import { formatarMoeda, formatarData } from '@/utilitarios/formatadores';
import { AbaEntradasParams } from '@/tipos/Navegacao';
import { useEntradas } from '@/hooks/useEntradas';
import { useCategorias } from '@/hooks/useCategorias';
import { Entrada } from '@/tipos/Entrada';

type NavegacaoEntradas = NativeStackNavigationProp<AbaEntradasParams>;

export default function TelaListaEntradas() {
  const navegacao = useNavigation<NavegacaoEntradas>();
  const insets = useSafeAreaInsets();
  const { entradas, carregando, excluir } = useEntradas();
  const { categorias } = useCategorias();

  function obterNomeCategoria(categoriaId: number | null): string {
    if (!categoriaId) return '';
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nome : '';
  }

  function confirmarExclusao(id: number) {
    Alert.alert(
      'Excluir Entrada',
      'Tem certeza que deseja excluir esta entrada?',
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

  function renderizarItem({ item }: { item: Entrada }) {
    const nomeCategoria = obterNomeCategoria(item.categoria_id);

    return (
      <TouchableOpacity
        onPress={() => navegacao.navigate('TelaFormEntrada', { id: item.id })}
        onLongPress={() => confirmarExclusao(item.id)}
        style={estilos.itemContainer}
      >
        <View style={estilos.itemIconeContainer}>
          <View style={estilos.itemIcone}>
            <Ionicons name="arrow-up" size={18} color={CORES.entradaCor} />
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
        </View>
        <View style={estilos.itemDireita}>
          <Text style={estilos.itemValor}>{formatarMoeda(item.valor)}</Text>
          {item.recorrente === 1 && (
            <View style={estilos.badgeRecorrente}>
              <Text style={estilos.textoBadge}>Recorrente</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  function renderizarVazio() {
    return (
      <View style={estilos.listaVazia}>
        <View style={estilos.vazioIcone}>
          <Ionicons name="wallet-outline" size={40} color={CORES.primaria} />
        </View>
        <Text style={estilos.textoVazio}>Nenhuma entrada cadastrada</Text>
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
          <Text style={estilos.titulo}>Entradas</Text>
          <TouchableOpacity
            style={estilos.botaoTemplates}
            onPress={() => navegacao.navigate('TelaTemplatesEntrada')}
          >
            <Ionicons name="bookmark-outline" size={18} color="#FFFFFF" />
            <Text style={estilos.textoTemplates}>Templates</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {carregando ? (
        <View style={estilos.carregando}>
          <ActivityIndicator size="large" color={CORES.primaria} />
        </View>
      ) : (
        <FlatList
          data={entradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderizarItem}
          ListEmptyComponent={renderizarVazio}
          contentContainerStyle={entradas.length === 0 ? estilos.listaVaziaContainer : estilos.listaConteudo}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={estilos.botaoAdicionar}
        onPress={() => navegacao.navigate('TelaFormEntrada')}
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
  botaoTemplates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  textoTemplates: {
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
    backgroundColor: 'rgba(33,150,243,0.1)',
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
    backgroundColor: 'rgba(76,175,80,0.1)',
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
  itemDireita: {
    alignItems: 'flex-end',
  },
  itemValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CORES.entradaCor,
  },
  badgeRecorrente: {
    marginTop: 4,
    backgroundColor: 'rgba(33,150,243,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  textoBadge: {
    fontSize: 10,
    color: CORES.primaria,
    fontWeight: '600',
  },
  botaoAdicionar: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CORES.entradaCor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: CORES.entradaCor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
