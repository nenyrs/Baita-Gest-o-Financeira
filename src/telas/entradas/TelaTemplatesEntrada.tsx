import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from '@/utilitarios/constantes';
import { formatarMoeda } from '@/utilitarios/formatadores';
import { AbaEntradasParams } from '@/tipos/Navegacao';
import { useTemplatesEntrada, useEntradas } from '@/hooks/useEntradas';
import { useCategorias } from '@/hooks/useCategorias';
import { TemplateEntrada } from '@/tipos/Entrada';
import CampoTexto from '@/componentes/comuns/CampoTexto';
import Botao from '@/componentes/comuns/Botao';
import SeletorCategoria from '@/componentes/comuns/SeletorCategoria';
import CartaoVidro from '@/componentes/comuns/CartaoVidro';

type NavegacaoEntradas = NativeStackNavigationProp<AbaEntradasParams>;

export default function TelaTemplatesEntrada() {
  const navegacao = useNavigation<NavegacaoEntradas>();
  const { templates, criar, excluir } = useTemplatesEntrada();
  const { criar: criarEntrada } = useEntradas();
  const { categorias } = useCategorias('entrada');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [seletorCategoriaVisivel, setSeletorCategoriaVisivel] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  function obterNomeCategoria(id: number | null): string {
    if (!id) return '';
    return categorias.find((c) => c.id === id)?.nome ?? '';
  }

  async function salvarTemplate() {
    if (!descricao.trim() || !valor.trim()) {
      Alert.alert('Erro', 'Preencha descricao e valor');
      return;
    }
    await criar({ descricao: descricao.trim(), valor: parseFloat(valor), categoria_id: categoriaId });
    setDescricao('');
    setValor('');
    setCategoriaId(null);
    setModalVisivel(false);
  }

  function usarTemplate(template: TemplateEntrada) {
    const hoje = new Date().toISOString().split('T')[0];
    Alert.alert(
      'Usar Template',
      `Criar entrada "${template.descricao}" de ${formatarMoeda(template.valor)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Criar',
          onPress: async () => {
            await criarEntrada({
              titulo: template.descricao,
              valor: template.valor,
              data: hoje,
              recorrente: 0,
              categoria_id: template.categoria_id,
            });
            Alert.alert('Sucesso', 'Entrada criada a partir do template!');
          },
        },
      ]
    );
  }

  function confirmarExclusao(id: number) {
    Alert.alert('Excluir', 'Excluir este template?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir(id) },
    ]);
  }

  return (
    <View style={estilos.container}>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={estilos.listaVazia}>
            <Ionicons name="bookmark-outline" size={48} color="rgba(0,0,0,0.2)" />
            <Text style={estilos.textoVazio}>Nenhum template cadastrado</Text>
            <Text style={estilos.textoVazioSub}>
              Templates permitem criar entradas rapidamente com dados pre-preenchidos
            </Text>
          </View>
        }
        contentContainerStyle={templates.length === 0 ? { flex: 1 } : { paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => usarTemplate(item)}
            onLongPress={() => confirmarExclusao(item.id)}
          >
            <CartaoVidro estiloContainer={estilos.itemCartaoVidro}>
              <View style={estilos.itemConteudo}>
                <View style={estilos.itemEsquerda}>
                  <Text style={estilos.itemDescricao}>{item.descricao}</Text>
                  {item.categoria_id && (
                    <Text style={estilos.itemCategoria}>{obterNomeCategoria(item.categoria_id)}</Text>
                  )}
                </View>
                <View style={estilos.itemDireita}>
                  <Text style={estilos.itemValor}>{formatarMoeda(item.valor)}</Text>
                  <Ionicons name="arrow-forward-circle" size={20} color={CORES.entradaCor} />
                </View>
              </View>
            </CartaoVidro>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={estilos.botaoAdicionar} onPress={() => setModalVisivel(true)}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalConteudo}>
            <ScrollView>
              <Text style={estilos.modalTitulo}>Novo Template</Text>
              <CampoTexto rotulo="Descricao" value={descricao} onChangeText={setDescricao} placeholder="Ex: Freelance Design" />
              <CampoTexto rotulo="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" placeholder="0.00" />
              <TouchableOpacity
                style={estilos.campoCategoriaBtn}
                onPress={() => setSeletorCategoriaVisivel(true)}
              >
                <Text style={estilos.campoCategoriaLabel}>Categoria</Text>
                <Text style={estilos.campoCategoriaValor}>
                  {categoriaId ? obterNomeCategoria(categoriaId) : 'Selecionar...'}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 40 }}>
                <View style={{ flex: 1 }}>
                  <Botao titulo="Cancelar" onPress={() => setModalVisivel(false)} variante="secundario" />
                </View>
                <View style={{ flex: 1 }}>
                  <Botao titulo="Salvar" onPress={salvarTemplate} />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <SeletorCategoria
        categorias={categorias}
        categoriaSelecionada={categoriaId}
        onSelecionar={setCategoriaId}
        visivel={seletorCategoriaVisivel}
        onFechar={() => setSeletorCategoriaVisivel(false)}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
    padding: 16,
    paddingTop: 16,
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  textoVazio: {
    fontSize: 16,
    color: CORES.textoSecundario,
    marginTop: 12,
    fontWeight: '600',
  },
  textoVazioSub: {
    fontSize: 14,
    color: CORES.textoSecundario,
    marginTop: 8,
    textAlign: 'center',
  },
  itemCartaoVidro: {
    marginBottom: 10,
  },
  itemConteudo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemEsquerda: {
    flex: 1,
    marginRight: 12,
  },
  itemDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.texto,
  },
  itemCategoria: {
    fontSize: 13,
    color: CORES.primaria,
    marginTop: 4,
  },
  itemDireita: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CORES.entradaCor,
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
    elevation: 4,
    shadowColor: CORES.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalConteudo: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 16,
  },
  campoCategoriaBtn: {
    marginBottom: 16,
  },
  campoCategoriaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 6,
  },
  campoCategoriaValor: {
    backgroundColor: CORES.fundoCartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: CORES.texto,
  },
});
