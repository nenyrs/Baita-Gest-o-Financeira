import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Categoria } from '@/tipos/Categoria';
import { CORES } from '@/utilitarios/constantes';

interface SeletorCategoriaProps {
  categorias: Categoria[];
  categoriaSelecionada: number | null;
  onSelecionar: (id: number | null) => void;
  visivel: boolean;
  onFechar: () => void;
}

export default function SeletorCategoria({
  categorias,
  categoriaSelecionada,
  onSelecionar,
  visivel,
  onFechar,
}: SeletorCategoriaProps) {
  return (
    <Modal visible={visivel} transparent animationType="slide">
      <View style={estilos.overlay}>
        <View style={estilos.container}>
          <View style={estilos.cabecalho}>
            <Text style={estilos.titulo}>Selecionar Categoria</Text>
            <TouchableOpacity onPress={onFechar}>
              <Ionicons name="close" size={24} color={CORES.texto} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={categorias}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  estilos.item,
                  categoriaSelecionada === item.id && estilos.itemSelecionado,
                ]}
                onPress={() => {
                  onSelecionar(item.id);
                  onFechar();
                }}
              >
                <View style={[estilos.bolinha, { backgroundColor: item.cor }]} />
                <Text style={estilos.nomeCategoria}>{item.nome}</Text>
                {categoriaSelecionada === item.id && (
                  <Ionicons name="checkmark" size={20} color={CORES.primariaSuave} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    padding: 16,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: CORES.texto,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  itemSelecionado: {
    backgroundColor: '#F0F4FF',
  },
  bolinha: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  nomeCategoria: {
    flex: 1,
    fontSize: 16,
    color: CORES.texto,
  },
});
