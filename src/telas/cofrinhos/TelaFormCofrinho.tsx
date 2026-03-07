import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CORES } from '@/utilitarios/constantes';
import { AbaMaisParams } from '@/tipos/Navegacao';
import { useCofrinhos } from '@/hooks/useCofrinhos';
import CampoTexto from '@/componentes/comuns/CampoTexto';
import Botao from '@/componentes/comuns/Botao';

type NavegacaoMais = NativeStackNavigationProp<AbaMaisParams, 'TelaFormCofrinho'>;

export default function TelaFormCofrinho() {
  const navegacao = useNavigation<NavegacaoMais>();
  const { criar } = useCofrinhos();

  const [nome, setNome] = useState('');
  const [banco, setBanco] = useState('');
  const [valorAlocado, setValorAlocado] = useState('');
  const [rentabilidade, setRentabilidade] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Informe o nome do cofrinho.');
      return;
    }

    const valorNumerico = parseFloat(valorAlocado.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico < 0) {
      Alert.alert('Erro', 'Informe um valor alocado valido.');
      return;
    }

    const rentabilidadeNum = parseFloat(rentabilidade.replace(',', '.'));
    if (isNaN(rentabilidadeNum) || rentabilidadeNum < 0) {
      Alert.alert('Erro', 'Informe uma rentabilidade valida.');
      return;
    }

    setSalvando(true);
    try {
      await criar({
        nome: nome.trim(),
        banco: banco.trim() || null,
        valor_alocado: valorNumerico,
        rentabilidade: rentabilidadeNum,
      });

      navegacao.goBack();
    } catch (erro) {
      Alert.alert('Erro', 'Nao foi possivel salvar o cofrinho.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.tituloPagina}>Novo Cofrinho</Text>

      <CampoTexto
        rotulo="Nome"
        placeholder="Ex: Reserva de emergencia"
        value={nome}
        onChangeText={setNome}
      />

      <CampoTexto
        rotulo="Banco"
        placeholder="Ex: Nubank"
        value={banco}
        onChangeText={setBanco}
      />

      <CampoTexto
        rotulo="Valor Alocado (R$)"
        placeholder="0.00"
        value={valorAlocado}
        onChangeText={setValorAlocado}
        keyboardType="numeric"
      />

      <CampoTexto
        rotulo="Rentabilidade Mensal (%)"
        placeholder="Ex: 1.05"
        value={rentabilidade}
        onChangeText={setRentabilidade}
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
