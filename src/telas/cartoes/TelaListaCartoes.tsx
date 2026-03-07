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
import { formatarMoeda } from '@/utilitarios/formatadores';
import { AbaCartoesParams } from '@/tipos/Navegacao';
import { useCartoes } from '@/hooks/useCartoes';
import { Cartao } from '@/tipos/Cartao';

type NavegacaoCartoes = NativeStackNavigationProp<AbaCartoesParams>;

export default function TelaListaCartoes() {
  const navegacao = useNavigation<NavegacaoCartoes>();
  const insets = useSafeAreaInsets();
  const { cartoes, carregando, excluir } = useCartoes();

  function confirmarExclusao(id: number) {
    Alert.alert(
      'Excluir Cartao',
      'Tem certeza que deseja excluir este cartao? Todas as parcelas associadas tambem serao removidas.',
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

  function renderizarItem({ item }: { item: Cartao }) {
    return (
      <TouchableOpacity
        onPress={() => navegacao.navigate('TelaFormCartao', { id: item.id })}
        onLongPress={() => confirmarExclusao(item.id)}
      >
        <LinearGradient
          colors={['#1565C0', '#42A5F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={estilos.itemContainer}
        >
          <View style={estilos.itemCabecalho}>
            <View style={estilos.itemIcone}>
              <Ionicons name="card" size={20} color="#FFFFFF" />
            </View>
            <Text style={estilos.itemNome}>{item.nome}</Text>
          </View>
          <Text style={estilos.itemLimite}>
            {formatarMoeda(item.limite_total)}
          </Text>
          <Text style={estilos.itemLimiteLabel}>Limite Total</Text>
          <View style={estilos.itemDatas}>
            <View style={estilos.itemDataBox}>
              <Text style={estilos.itemDataRotulo}>Vencimento</Text>
              <Text style={estilos.itemDataValor}>Dia {item.dia_vencimento}</Text>
            </View>
            <View style={estilos.itemDataBox}>
              <Text style={estilos.itemDataRotulo}>Fechamento</Text>
              <Text style={estilos.itemDataValor}>Dia {item.dia_fechamento}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function renderizarVazio() {
    return (
      <View style={estilos.listaVazia}>
        <View style={estilos.vazioIcone}>
          <Ionicons name="card-outline" size={40} color={CORES.primaria} />
        </View>
        <Text style={estilos.textoVazio}>Nenhum cartao cadastrado</Text>
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
        <Text style={estilos.titulo}>Cartoes</Text>
      </LinearGradient>

      {carregando ? (
        <View style={estilos.carregando}>
          <ActivityIndicator size="large" color={CORES.primaria} />
        </View>
      ) : (
        <FlatList
          data={cartoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderizarItem}
          ListEmptyComponent={renderizarVazio}
          contentContainerStyle={cartoes.length === 0 ? estilos.listaVaziaContainer : estilos.listaConteudo}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={estilos.botaoAdicionar}
        onPress={() => navegacao.navigate('TelaFormCartao')}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  itemCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  itemIcone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemLimite: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  itemLimiteLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  itemDatas: {
    flexDirection: 'row',
    gap: 12,
  },
  itemDataBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  itemDataRotulo: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  itemDataValor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  botaoAdicionar: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CORES.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: CORES.primaria,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
