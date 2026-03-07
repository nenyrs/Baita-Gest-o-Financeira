import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CORES, GRADIENTE_CABECALHO } from '@/utilitarios/constantes';
import { useCategorias } from '@/hooks/useCategorias';
import { useTemplatesEntrada } from '@/hooks/useEntradas';
import { TipoCategoria } from '@/tipos/Categoria';
import CampoTexto from '@/componentes/comuns/CampoTexto';
import Botao from '@/componentes/comuns/Botao';

const CORES_CATEGORIAS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF8A65',
  '#7C4DFF', '#F06292', '#FFD93D', '#90A4AE', '#4CAF50',
  '#66BB6A', '#2E7D32', '#43A047', '#81C784', '#FF5722',
];

export default function TelaConfiguracoes() {
  const navegacao = useNavigation();
  const insets = useSafeAreaInsets();
  const categoriasEntrada = useCategorias('entrada');
  const categoriasSaida = useCategorias('saida');
  const { templates, excluir: excluirTemplate } = useTemplatesEntrada();

  const [notificacaoAtiva, setNotificacaoAtiva] = useState(false);
  const [modalCategoriaVisivel, setModalCategoriaVisivel] = useState(false);
  const [tipoNovaCategoria, setTipoNovaCategoria] = useState<TipoCategoria>('saida');
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [corSelecionada, setCorSelecionada] = useState(CORES_CATEGORIAS[0]);

  async function salvarCategoria() {
    if (!nomeCategoria.trim()) {
      Alert.alert('Erro', 'Informe o nome da categoria.');
      return;
    }
    const hook = tipoNovaCategoria === 'entrada' ? categoriasEntrada : categoriasSaida;
    await hook.criar({ nome: nomeCategoria.trim(), cor: corSelecionada, tipo: tipoNovaCategoria });
    setNomeCategoria('');
    setCorSelecionada(CORES_CATEGORIAS[0]);
    setModalCategoriaVisivel(false);
  }

  function confirmarExcluirCategoria(id: number, nome: string, tipo: TipoCategoria) {
    Alert.alert('Excluir Categoria', `Excluir "${nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: () => {
          const hook = tipo === 'entrada' ? categoriasEntrada : categoriasSaida;
          hook.excluir(id);
        },
      },
    ]);
  }

  function confirmarExcluirTemplate(id: number, desc: string) {
    Alert.alert('Excluir Template', `Excluir "${desc}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluirTemplate(id) },
    ]);
  }

  function abrirModalCategoria(tipo: TipoCategoria) {
    setTipoNovaCategoria(tipo);
    setNomeCategoria('');
    setCorSelecionada(CORES_CATEGORIAS[0]);
    setModalCategoriaVisivel(true);
  }

  return (
    <View style={estilos.container}>
      <LinearGradient
        colors={[...GRADIENTE_CABECALHO]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[estilos.cabecalho, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity onPress={() => navegacao.goBack()} style={estilos.botaoVoltar}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={estilos.cabecalhoTitulo}>Configurações</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView
        style={estilos.corpo}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Notificações */}
        <View style={estilos.secao}>
          <Text style={estilos.secaoTitulo}>Notificações</Text>
          <View style={estilos.itemConfig}>
            <View style={estilos.itemConfigEsquerda}>
              <Ionicons name="notifications-outline" size={22} color={CORES.primaria} />
              <View>
                <Text style={estilos.itemConfigTexto}>Lembrete de vencimento</Text>
                <Text style={estilos.itemConfigSub}>Notificar 1 dia antes do vencimento</Text>
              </View>
            </View>
            <Switch
              value={notificacaoAtiva}
              onValueChange={setNotificacaoAtiva}
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={notificacaoAtiva ? CORES.primaria : '#BDBDBD'}
            />
          </View>
        </View>

        {/* Categorias de Entrada */}
        <View style={estilos.secao}>
          <View style={estilos.secaoCabecalho}>
            <Text style={estilos.secaoTitulo}>Categorias de Entrada</Text>
            <TouchableOpacity onPress={() => abrirModalCategoria('entrada')}>
              <Ionicons name="add-circle" size={26} color={CORES.entradaCor} />
            </TouchableOpacity>
          </View>
          {categoriasEntrada.categorias.map((cat) => (
            <View key={cat.id} style={estilos.itemCategoria}>
              <View style={estilos.itemCategoriaEsquerda}>
                <View style={[estilos.categoriaCorBola, { backgroundColor: cat.cor }]} />
                <Text style={estilos.categoriaNome}>{cat.nome}</Text>
              </View>
              <TouchableOpacity onPress={() => confirmarExcluirCategoria(cat.id, cat.nome, 'entrada')}>
                <Ionicons name="trash-outline" size={18} color="#EF5350" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Categorias de Saída */}
        <View style={estilos.secao}>
          <View style={estilos.secaoCabecalho}>
            <Text style={estilos.secaoTitulo}>Categorias de Saída</Text>
            <TouchableOpacity onPress={() => abrirModalCategoria('saida')}>
              <Ionicons name="add-circle" size={26} color={CORES.saidaCor} />
            </TouchableOpacity>
          </View>
          {categoriasSaida.categorias.map((cat) => (
            <View key={cat.id} style={estilos.itemCategoria}>
              <View style={estilos.itemCategoriaEsquerda}>
                <View style={[estilos.categoriaCorBola, { backgroundColor: cat.cor }]} />
                <Text style={estilos.categoriaNome}>{cat.nome}</Text>
              </View>
              <TouchableOpacity onPress={() => confirmarExcluirCategoria(cat.id, cat.nome, 'saida')}>
                <Ionicons name="trash-outline" size={18} color="#EF5350" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Templates Ativos */}
        <View style={estilos.secao}>
          <Text style={estilos.secaoTitulo}>Templates Ativos</Text>
          {templates.length === 0 ? (
            <Text style={estilos.textoVazio}>Nenhum template cadastrado</Text>
          ) : (
            templates.map((t) => (
              <View key={t.id} style={estilos.itemCategoria}>
                <Text style={estilos.categoriaNome}>{t.descricao}</Text>
                <TouchableOpacity onPress={() => confirmarExcluirTemplate(t.id, t.descricao)}>
                  <Ionicons name="trash-outline" size={18} color="#EF5350" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal Nova Categoria */}
      <Modal visible={modalCategoriaVisivel} animationType="slide" transparent>
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalConteudo}>
            <Text style={estilos.modalTitulo}>
              Nova Categoria de {tipoNovaCategoria === 'entrada' ? 'Entrada' : 'Saída'}
            </Text>

            <CampoTexto
              rotulo="Nome"
              placeholder="Ex: Alimentação"
              value={nomeCategoria}
              onChangeText={setNomeCategoria}
            />

            <Text style={estilos.rotuloCorLabel}>Cor</Text>
            <View style={estilos.coresGrid}>
              {CORES_CATEGORIAS.map((cor) => (
                <TouchableOpacity
                  key={cor}
                  style={[
                    estilos.corItem,
                    { backgroundColor: cor },
                    corSelecionada === cor && estilos.corItemSelecionada,
                  ]}
                  onPress={() => setCorSelecionada(cor)}
                />
              ))}
            </View>

            <View style={estilos.modalBotoes}>
              <View style={{ flex: 1 }}>
                <Botao titulo="Cancelar" onPress={() => setModalCategoriaVisivel(false)} variante="secundario" />
              </View>
              <View style={{ flex: 1 }}>
                <Botao titulo="Salvar" onPress={salvarCategoria} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cabecalhoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  corpo: {
    flex: 1,
    padding: 16,
  },
  secao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  secaoCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secaoTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: CORES.texto,
    marginBottom: 12,
  },
  itemConfig: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemConfigEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemConfigTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: CORES.texto,
  },
  itemConfigSub: {
    fontSize: 12,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  itemCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  itemCategoriaEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoriaCorBola: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  categoriaNome: {
    fontSize: 15,
    fontWeight: '500',
    color: CORES.texto,
  },
  textoVazio: {
    fontSize: 14,
    color: CORES.textoSecundario,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalConteudo: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 16,
  },
  rotuloCorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 8,
  },
  coresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  corItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  corItemSelecionada: {
    borderWidth: 3,
    borderColor: CORES.texto,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 8,
  },
});
