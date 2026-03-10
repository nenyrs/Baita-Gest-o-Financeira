import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CORES } from '@/utilitarios/constantes';
import { AbaCartoesParams } from '@/tipos/Navegacao';
import { useCartoes } from '@/hooks/useCartoes';
import CampoTexto from '@/componentes/comuns/CampoTexto';
import Botao from '@/componentes/comuns/Botao';

type NavegacaoCartoes = NativeStackNavigationProp<AbaCartoesParams, 'TelaFormCartao'>;
type RotaCartao = RouteProp<AbaCartoesParams, 'TelaFormCartao'>;

export default function TelaFormCartao() {
  const navegacao = useNavigation<NavegacaoCartoes>();
  const rota = useRoute<RotaCartao>();
  const idEdicao = rota.params?.id;

  const { cartoes, criar, atualizar } = useCartoes();

  const [nome, setNome] = useState('');
  const [limiteTotal, setLimiteTotal] = useState('');
  const [diaVencimento, setDiaVencimento] = useState('');
  const [diaFechamento, setDiaFechamento] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (idEdicao) {
      const cartao = cartoes.find((c) => c.id === idEdicao);
      if (cartao) {
        setNome(cartao.nome);
        setLimiteTotal(String(cartao.limite_total));
        setDiaVencimento(String(cartao.dia_vencimento));
        setDiaFechamento(String(cartao.dia_fechamento));
      }
    }
  }, [idEdicao, cartoes]);

  async function handleSalvar() {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Informe o nome do cartao.');
      return;
    }

    const limiteNumerico = parseFloat(limiteTotal.replace(',', '.'));
    if (isNaN(limiteNumerico) || limiteNumerico <= 0) {
      Alert.alert('Erro', 'Informe um limite valido.');
      return;
    }

    const vencimento = parseInt(diaVencimento, 10);
    if (isNaN(vencimento) || vencimento < 1 || vencimento > 31) {
      Alert.alert('Erro', 'Informe um dia de vencimento valido (1-31).');
      return;
    }

    const fechamento = parseInt(diaFechamento, 10);
    if (isNaN(fechamento) || fechamento < 1 || fechamento > 31) {
      Alert.alert('Erro', 'Informe um dia de fechamento valido (1-31).');
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        nome: nome.trim(),
        limite_total: limiteNumerico,
        dia_vencimento: vencimento,
        dia_fechamento: fechamento,
      };

      if (idEdicao) {
        await atualizar(idEdicao, dados);
      } else {
        await criar(dados);
      }

      navegacao.goBack();
    } catch (erro) {
      Alert.alert('Erro', 'Nao foi possivel salvar o cartao.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.tituloPagina}>
        {idEdicao ? 'Editar Cartao' : 'Novo Cartao'}
      </Text>

      <CampoTexto
        rotulo="Nome"
        placeholder="Ex: Nubank"
        value={nome}
        onChangeText={setNome}
      />

      <CampoTexto
        rotulo="Limite Total (R$)"
        placeholder="0.00"
        value={limiteTotal}
        onChangeText={setLimiteTotal}
        keyboardType="numeric"
      />

      <CampoTexto
        rotulo="Dia de Vencimento (1-31)"
        placeholder="Ex: 10"
        value={diaVencimento}
        onChangeText={setDiaVencimento}
        keyboardType="numeric"
      />

      <CampoTexto
        rotulo="Dia de Fechamento (1-31)"
        placeholder="Ex: 3"
        value={diaFechamento}
        onChangeText={setDiaFechamento}
        keyboardType="numeric"
      />

      <Botao
        titulo={salvando ? 'Salvando...' : 'Salvar'}
        onPress={handleSalvar}
        desabilitado={salvando}
        estiloContainer={estilos.botaoSalvar}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudo: {
    padding: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  tituloPagina: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 24,
  },
  botaoSalvar: {
    marginTop: 8,
  },
});
