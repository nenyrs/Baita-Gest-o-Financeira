import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBancoDados } from '@/contextos/ContextoBancoDados';
import { useMesSelecionado } from '@/contextos/ContextoMesSelecionado';
import * as repoContasFixas from '@/repositorios/RepositorioContasFixas';
import { ContaFixa, ContaFixaHistorico } from '@/tipos/ContaFixa';
import { CORES } from '@/utilitarios/constantes';
import { formatarMoeda } from '@/utilitarios/formatadores';
import CampoTexto from '@/componentes/comuns/CampoTexto';
import Botao from '@/componentes/comuns/Botao';
import BadgeEstimativa from '@/componentes/saidas/BadgeEstimativa';

export default function TelaContasFixas() {
  const { banco } = useBancoDados();
  const { mesFormatado } = useMesSelecionado();
  const [contasFixas, setContasFixas] = useState<ContaFixa[]>([]);
  const [historico, setHistorico] = useState<(ContaFixaHistorico & { titulo: string; tipo: string })[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [diaVencimento, setDiaVencimento] = useState('');
  const [tipo, setTipo] = useState<'valor_exato' | 'valor_variavel'>('valor_exato');

  const carregar = useCallback(async () => {
    if (!banco) return;
    const contas = await repoContasFixas.listarContasFixas(banco);
    setContasFixas(contas);
    await repoContasFixas.gerarHistoricoContasFixas(banco, mesFormatado);
    const hist = await repoContasFixas.listarHistoricoDoMes(banco, mesFormatado);
    setHistorico(hist);
  }, [banco, mesFormatado]);

  useEffect(() => { carregar(); }, [carregar]);

  const salvar = async () => {
    if (!banco || !titulo.trim() || !valor.trim() || !diaVencimento.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatorios');
      return;
    }
    await repoContasFixas.criarContaFixa(banco, {
      titulo: titulo.trim(), tipo, valor: parseFloat(valor),
      dia_vencimento: parseInt(diaVencimento), categoria_id: null,
      metodo_pagamento: 'pix', cartao_id: null, ativa: 1,
    });
    setTitulo(''); setValor(''); setDiaVencimento('');
    setModalVisivel(false);
    await carregar();
  };

  const excluir = (id: number) => {
    Alert.alert('Excluir', 'Deseja excluir esta conta fixa?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        if (banco) { await repoContasFixas.excluirContaFixa(banco, id); await carregar(); }
      }},
    ]);
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.secaoTitulo}>Historico do Mes</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhuma conta fixa para este mes</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={estilos.itemHistorico}>
            <View style={estilos.itemInfo}>
              <Text style={estilos.itemTitulo}>{item.titulo}</Text>
              <View style={estilos.itemValorRow}>
                <Text style={estilos.itemValor}>{formatarMoeda(item.valor_real ?? item.valor_estimado)}</Text>
                {!item.confirmado && <BadgeEstimativa />}
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          <>
            <Text style={[estilos.secaoTitulo, { marginTop: 24 }]}>Contas Fixas Ativas</Text>
            {contasFixas.map((conta) => (
              <TouchableOpacity key={conta.id} style={estilos.itemConta} onLongPress={() => excluir(conta.id)}>
                <View>
                  <Text style={estilos.itemTitulo}>{conta.titulo}</Text>
                  <Text style={estilos.itemSubtitulo}>
                    {conta.tipo === 'valor_exato' ? 'Valor exato' : 'Valor variavel'} - Vence dia {conta.dia_vencimento}
                  </Text>
                </View>
                <Text style={estilos.itemValor}>{formatarMoeda(conta.valor)}</Text>
              </TouchableOpacity>
            ))}
          </>
        }
      />
      <TouchableOpacity style={estilos.botaoAdicionar} onPress={() => setModalVisivel(true)}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalConteudo}>
            <ScrollView>
              <Text style={estilos.modalTitulo}>Nova Conta Fixa</Text>
              <CampoTexto rotulo="Titulo" value={titulo} onChangeText={setTitulo} placeholder="Ex: Conta de Luz" />
              <CampoTexto rotulo="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" placeholder="0.00" />
              <CampoTexto rotulo="Dia de Vencimento" value={diaVencimento} onChangeText={setDiaVencimento} keyboardType="numeric" placeholder="1-31" />
              <Text style={estilos.rotuloTipo}>Tipo</Text>
              <View style={estilos.tipoRow}>
                <TouchableOpacity style={[estilos.tipoBotao, tipo === 'valor_exato' && estilos.tipoBotaoAtivo]} onPress={() => setTipo('valor_exato')}>
                  <Text style={[estilos.tipoBotaoTexto, tipo === 'valor_exato' && estilos.tipoBotaoTextoAtivo]}>Valor Exato</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[estilos.tipoBotao, tipo === 'valor_variavel' && estilos.tipoBotaoAtivo]} onPress={() => setTipo('valor_variavel')}>
                  <Text style={[estilos.tipoBotaoTexto, tipo === 'valor_variavel' && estilos.tipoBotaoTextoAtivo]}>Valor Variavel</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                <View style={{ flex: 1 }}><Botao titulo="Cancelar" onPress={() => setModalVisivel(false)} variante="secundario" /></View>
                <View style={{ flex: 1 }}><Botao titulo="Salvar" onPress={salvar} /></View>
              </View>
            </ScrollView>
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
    padding: 16,
    paddingTop: 16,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 12,
  },
  textoVazio: {
    fontSize: 14,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginTop: 20,
  },
  itemHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.fundoCartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: '500',
    color: CORES.texto,
  },
  itemValorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  itemValor: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.saidaCor,
  },
  itemSubtitulo: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  itemConta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CORES.fundoCartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
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
  rotuloTipo: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 8,
    marginTop: 8,
  },
  tipoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tipoBotao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    alignItems: 'center',
    backgroundColor: CORES.fundoCartao,
  },
  tipoBotaoAtivo: {
    backgroundColor: CORES.primaria,
    borderColor: CORES.primaria,
  },
  tipoBotaoTexto: {
    fontSize: 14,
    color: CORES.texto,
  },
  tipoBotaoTextoAtivo: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
