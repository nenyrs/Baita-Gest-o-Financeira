import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CORES, METODOS_PAGAMENTO } from '@/utilitarios/constantes';
import { dataParaString } from '@/utilitarios/formatadores';
import { AbaSaidasParams } from '@/tipos/Navegacao';
import { MetodoPagamento } from '@/tipos/Saida';
import { useSaidas } from '@/hooks/useSaidas';
import { useCartoes } from '@/hooks/useCartoes';
import { useCategorias } from '@/hooks/useCategorias';
import CampoTexto from '@/componentes/comuns/CampoTexto';
import Botao from '@/componentes/comuns/Botao';
import SeletorCategoria from '@/componentes/comuns/SeletorCategoria';
import SeletorData from '@/componentes/comuns/SeletorData';

type NavegacaoSaidas = NativeStackNavigationProp<AbaSaidasParams, 'TelaFormSaida'>;
type RotaSaida = RouteProp<AbaSaidasParams, 'TelaFormSaida'>;

export default function TelaFormSaida() {
  const navegacao = useNavigation<NavegacaoSaidas>();
  const rota = useRoute<RotaSaida>();
  const idEdicao = rota.params?.id;

  const { saidas, criar, atualizar } = useSaidas();
  const { cartoes } = useCartoes();
  const { categorias } = useCategorias('saida');

  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(dataParaString(new Date()));
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>('pix');
  const [cartaoId, setCartaoId] = useState<number | null>(null);
  const [totalParcelas, setTotalParcelas] = useState('1');
  const [valorEhTotal, setValorEhTotal] = useState(true);
  const [modalCategoriaVisivel, setModalCategoriaVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (idEdicao) {
      const saida = saidas.find((s) => s.id === idEdicao);
      if (saida) {
        setTitulo(saida.titulo);
        setValor(String(saida.valor));
        setData(saida.data);
        setCategoriaId(saida.categoria_id);
        setMetodoPagamento(saida.metodo_pagamento as MetodoPagamento);
        setCartaoId(saida.cartao_id);
        setTotalParcelas(String(saida.total_parcelas || 1));
        setValorEhTotal(false); // Em edicao, o valor ja esta por parcela
      }
    }
  }, [idEdicao, saidas]);

  const categoriaSelecionada = categorias.find((c) => c.id === categoriaId);
  const cartaoSelecionado = cartoes.find((c) => c.id === cartaoId);
  const usaCartao = metodoPagamento === 'credito' || metodoPagamento === 'debito';
  const ehCredito = metodoPagamento === 'credito';
  const numParcelas = parseInt(totalParcelas, 10) || 1;
  const valorNumericoPreview = parseFloat(valor.replace(',', '.')) || 0;

  // Calcula valor da parcela para preview
  const valorParcelaPreview = ehCredito && valorEhTotal && numParcelas > 1
    ? Math.round((valorNumericoPreview / numParcelas) * 100) / 100
    : valorNumericoPreview;

  async function handleSalvar() {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Informe o titulo da saida.');
      return;
    }

    const valorDigitado = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorDigitado) || valorDigitado <= 0) {
      Alert.alert('Erro', 'Informe um valor valido.');
      return;
    }

    if (!data.trim()) {
      Alert.alert('Erro', 'Informe a data.');
      return;
    }

    if (usaCartao && !cartaoId) {
      Alert.alert('Erro', 'Selecione um cartao.');
      return;
    }

    // Credito: parcelas informadas; Debito: 1 parcela (respeita fechamento do cartao)
    const parcelas = ehCredito
      ? numParcelas
      : metodoPagamento === 'debito' ? 1 : 0;

    // Se "Valor Total" estiver ativo no credito, o valor salvo por parcela = valorDigitado / parcelas
    // O valor salvo na saida eh o valor da parcela (que sera multiplicado no gerarParcelas)
    const valorFinal = ehCredito && valorEhTotal && numParcelas > 1
      ? Math.round((valorDigitado / numParcelas) * 100) / 100
      : valorDigitado;

    setSalvando(true);
    try {
      const dados = {
        titulo: titulo.trim(),
        valor: valorFinal,
        data,
        categoria_id: categoriaId,
        metodo_pagamento: metodoPagamento,
        cartao_id: usaCartao ? cartaoId : null,
        total_parcelas: parcelas,
      };

      if (idEdicao) {
        await atualizar(idEdicao, dados);
      } else {
        await criar(dados);
      }

      navegacao.goBack();
    } catch (erro) {
      Alert.alert('Erro', 'Nao foi possivel salvar a saida.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.tituloPagina}>
        {idEdicao ? 'Editar Saida' : 'Nova Saida'}
      </Text>

      <CampoTexto
        rotulo="Titulo"
        placeholder="Ex: Supermercado"
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

      <Text style={estilos.rotuloCampo}>Metodo de Pagamento</Text>
      <View style={estilos.metodosPagamento}>
        {METODOS_PAGAMENTO.map((metodo) => (
          <TouchableOpacity
            key={metodo.valor}
            style={[
              estilos.botaoMetodo,
              metodoPagamento === metodo.valor && estilos.botaoMetodoAtivo,
            ]}
            onPress={() => {
              setMetodoPagamento(metodo.valor);
              if (metodo.valor === 'pix') {
                setCartaoId(null);
                setTotalParcelas('1');
                setValorEhTotal(true);
              }
            }}
          >
            <Text
              style={[
                estilos.textoMetodo,
                metodoPagamento === metodo.valor && estilos.textoMetodoAtivo,
              ]}
            >
              {metodo.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {usaCartao && (
        <View style={estilos.secaoCartao}>
          <Text style={estilos.rotuloCampo}>Cartao</Text>
          {cartoes.length === 0 ? (
            <Text style={estilos.textoSemCartao}>
              Nenhum cartao cadastrado. Cadastre um cartao primeiro.
            </Text>
          ) : (
            <View style={estilos.listaCartoes}>
              {cartoes.map((cartao) => (
                <TouchableOpacity
                  key={cartao.id}
                  style={[
                    estilos.botaoCartao,
                    cartaoId === cartao.id && estilos.botaoCartaoAtivo,
                  ]}
                  onPress={() => setCartaoId(cartao.id)}
                >
                  <Text
                    style={[
                      estilos.textoCartao,
                      cartaoId === cartao.id && estilos.textoCartaoAtivo,
                    ]}
                  >
                    {cartao.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {cartaoSelecionado && (
            <View style={estilos.infoCartao}>
              <Text style={estilos.infoCartaoTexto}>
                Fechamento: dia {cartaoSelecionado.dia_fechamento}  |  Vencimento: dia {cartaoSelecionado.dia_vencimento}
              </Text>
            </View>
          )}

          {ehCredito && (
            <>
              <CampoTexto
                rotulo="Numero de Parcelas"
                placeholder="1"
                value={totalParcelas}
                onChangeText={setTotalParcelas}
                keyboardType="numeric"
              />

              {numParcelas > 1 && (
                <>
                  <View style={estilos.linhaSwitch}>
                    <View>
                      <Text style={estilos.rotuloSwitch}>Valor e total</Text>
                      <Text style={estilos.descricaoSwitch}>
                        {valorEhTotal
                          ? 'O valor sera dividido pelas parcelas'
                          : 'Cada parcela tera o valor informado'}
                      </Text>
                    </View>
                    <Switch
                      value={valorEhTotal}
                      onValueChange={setValorEhTotal}
                      trackColor={{ false: CORES.borda, true: 'rgba(33,150,243,0.4)' }}
                      thumbColor={valorEhTotal ? CORES.primaria : CORES.textoSecundario}
                    />
                  </View>

                  {valorNumericoPreview > 0 && (
                    <View style={estilos.previewParcelas}>
                      <Text style={estilos.previewTexto}>
                        {numParcelas}x de R$ {valorParcelaPreview.toFixed(2).replace('.', ',')}
                        {valorEhTotal
                          ? ` (total R$ ${valorNumericoPreview.toFixed(2).replace('.', ',')})`
                          : ` (total R$ ${(valorNumericoPreview * numParcelas).toFixed(2).replace('.', ',')})`}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </View>
      )}

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
  rotuloCampo: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 6,
  },
  botaoCategoria: {
    marginBottom: 24,
  },
  metodosPagamento: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  botaoMetodo: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    alignItems: 'center',
    backgroundColor: CORES.fundoCartao,
  },
  botaoMetodoAtivo: {
    borderColor: CORES.primaria,
    backgroundColor: CORES.primaria,
  },
  textoMetodo: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.texto,
  },
  textoMetodoAtivo: {
    color: '#FFFFFF',
  },
  secaoCartao: {
    marginBottom: 8,
  },
  textoSemCartao: {
    fontSize: 14,
    color: CORES.textoSecundario,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  listaCartoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  botaoCartao: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.fundoCartao,
  },
  botaoCartaoAtivo: {
    borderColor: CORES.primaria,
    backgroundColor: CORES.primaria,
  },
  textoCartao: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.texto,
  },
  textoCartaoAtivo: {
    color: '#FFFFFF',
  },
  infoCartao: {
    backgroundColor: 'rgba(33,150,243,0.08)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  infoCartaoTexto: {
    fontSize: 13,
    color: CORES.primaria,
    fontWeight: '500',
    textAlign: 'center',
  },
  linhaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: CORES.fundoCartao,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rotuloSwitch: {
    fontSize: 15,
    color: CORES.texto,
    fontWeight: '600',
  },
  descricaoSwitch: {
    fontSize: 12,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  previewParcelas: {
    backgroundColor: 'rgba(76,175,80,0.08)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  previewTexto: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  botaoSalvar: {
    marginTop: 8,
  },
});
