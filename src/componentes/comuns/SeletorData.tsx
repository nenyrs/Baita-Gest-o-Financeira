import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from '@/utilitarios/constantes';
import { formatarData, stringParaData, dataParaString } from '@/utilitarios/formatadores';

interface SeletorDataProps {
  rotulo: string;
  valor: string; // 'YYYY-MM-DD'
  onChange: (data: string) => void;
}

export default function SeletorData({ rotulo, valor, onChange }: SeletorDataProps) {
  const [mostrar, setMostrar] = useState(false);

  const dataAtual = valor ? stringParaData(valor) : new Date();

  function aoMudar(evento: DateTimePickerEvent, dataSelecionada?: Date) {
    if (Platform.OS === 'android') {
      setMostrar(false);
    }
    if (evento.type === 'set' && dataSelecionada) {
      onChange(dataParaString(dataSelecionada));
    }
  }

  function confirmarIOS(dataSelecionada: Date) {
    onChange(dataParaString(dataSelecionada));
    setMostrar(false);
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TouchableOpacity style={estilos.campo} onPress={() => setMostrar(true)}>
        <Text style={estilos.texto}>
          {valor ? formatarData(valor) : 'Selecionar data'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={CORES.primaria} />
      </TouchableOpacity>

      {mostrar && Platform.OS === 'android' && (
        <DateTimePicker
          value={dataAtual}
          mode="date"
          display="default"
          onChange={aoMudar}
        />
      )}

      {mostrar && Platform.OS === 'ios' && (
        <Modal transparent animationType="fade">
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalConteudo}>
              <View style={estilos.modalCabecalho}>
                <TouchableOpacity onPress={() => setMostrar(false)}>
                  <Text style={estilos.modalCancelar}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmarIOS(dataAtual)}>
                  <Text style={estilos.modalConfirmar}>Confirmar</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dataAtual}
                mode="date"
                display="spinner"
                onChange={(e, d) => {
                  if (d) onChange(dataParaString(d));
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.texto,
    marginBottom: 6,
  },
  campo: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  texto: {
    fontSize: 16,
    color: CORES.texto,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalConteudo: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  modalCancelar: {
    fontSize: 16,
    color: CORES.textoSecundario,
  },
  modalConfirmar: {
    fontSize: 16,
    color: CORES.primaria,
    fontWeight: '600',
  },
});
