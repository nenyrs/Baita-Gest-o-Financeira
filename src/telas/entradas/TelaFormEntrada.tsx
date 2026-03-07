import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CORES } from '@/utilitarios/constantes';
import { dataParaString } from '@/utilitarios/formatadores';
import { AbaEntradasParams } from '@/tipos/Navegacao';
import { useEntradas } from '@/hooks/useEntradas';
import { useCategorias } from '@/hooks/useCategorias';
import CampoTexto from '@/componentes/comuns/CampoTexto';
import Botao from '@/componentes/comuns/Botao';
import SeletorCategoria from '@/componentes/comuns/SeletorCategoria';
import SeletorData from '@/componentes/comuns/SeletorData';

type NavegacaoEntradas = NativeStackNavigationProp<AbaEntradasParams, 'TelaFormEntrada'>;
type RotaEntrada = RouteProp<AbaEntradasParams, 'TelaFormEntrada'>;

export default function TelaFormEntrada() {
  const navegacao = useNavigation<NavegacaoEntradas>();
  const rota = useRoute<RotaEntrada>();
  const idEdicao = rota.params?.id;

  const { entradas, criar, atualizar } = useEntradas();
  const { categorias } = useCategorias('entrada');

  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(dataParaString(new Date()));
  const [recorrente, setRecorrente] = useState(false);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [modalCategoriaVisivel, setModalCategoriaVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (idEdicao) {
      const entrada = entradas.find((e) => e.id === idEdicao);
      if (entrada) {
        setTitulo(entrada.titulo);
        setValor(String(entrada.valor));
        setData(entrada.data);
        setRecorrente(entrada.recorrente === 1);
        setCategoriaId(entrada.categoria_id);
      }
    }
  }, [idEdicao, entradas]);

  const categoriaSelecionada = categorias.find((c) => c.id === categoriaId);

  async function handleSalvar() {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Informe o titulo da entrada.');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'Informe um valor valido.');
      return;
    }

    if (!data.trim()) {
      Alert.alert('Erro', 'Informe a data.');
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        titulo: titulo.trim(),
        valor: valorNumerico,
        data,
        recorrente: recorrente ? 1 : 0,
        categoria_id: categoriaId,
      };

      if (idEdicao) {
        await atualizar(idEdicao, dados);
      } else {
        await criar(dados);
      }

      navegacao.goBack();
    } catch (erro) {
      Alert.alert('Erro', 'Nao foi possivel salvar a entrada.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.tituloPagina}>
        {idEdicao ? 'Editar Entrada' : 'Nova Entrada'}
      </Text>

      <CampoTexto
        rotulo="Titulo"
        placeholder="Ex: Salario"
        value={titulo}
        onChangeText={setTitulo}
      />

      <CampoTexto
        rotulo="Valor (R$)"
        placeholder="0.00"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <SeletorData
        rotulo="Data"
        valor={data}
        onChange={setData}
      />

      <View style={estilos.linhaSwitch}>
        <Text style={estilos.rotuloSwitch}>Recorrente</Text>
        <Switch
          value={recorrente}
          onValueChange={setRecorrente}
          trackColor={{ false: CORES.borda, true: 'rgba(33,150,243,0.4)' }}
          thumbColor={recorrente ? CORES.primaria : CORES.textoSecundario}
        />
      </View>

      <Text style={estilos.rotuloCampo}>Categoria</Text>
      <Botao
        titulo={categoriaSelecionada ? categoriaSelecionada.nome : 'Selecionar Categoria'}
        onPress={() => setModalCategoriaVisivel(true)}
        variante="secundario"
        estiloContainer={estilos.botaoCategoria}
      />

      <SeletorCategoria
        categorias={categorias}
        categoriaSelecionada={categoriaId}
        onSelecionar={setCategoriaId}
        visivel={modalCategoriaVisivel}
        onFechar={() => setModalCategoriaVisivel(false)}
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
    paddingBottom: 120,
    paddingTop: 16,
  },
  tituloPagina: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 24,
  },
  linhaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: CORES.fundoCartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rotuloSwitch: {
    fontSize: 16,
    color: CORES.texto,
    fontWeight: '600',
  },
  rotuloCampo: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 6,
  },
  botaoCategoria: {
    marginBottom: 24,
  },
  botaoSalvar: {
    marginTop: 8,
  },
});
