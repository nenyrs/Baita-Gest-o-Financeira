export const CORES = {
  primaria: '#2196F3',
  primariaSuave: '#64B5F6',
  primariaEscura: '#1565C0',
  secundaria: '#26A69A',
  secundariaSuave: '#4DB6AC',
  texto: '#1A1A2E',
  textoSecundario: '#8E8E93',
  textoBranco: '#FFFFFF',
  textoEscuro: '#1A1A2E',
  sucesso: '#66BB6A',
  erro: '#EF5350',
  alerta: '#FFA726',
  entradaCor: '#4CAF50',
  saidaCor: '#EF5350',
  estimativaCor: '#FFA726',
  fundo: '#F5F7FA',
  fundoCartao: '#FFFFFF',
  borda: '#E8ECF0',
  sombra: '#000000',
};

export const GRADIENTE_CABECALHO = ['#1565C0', '#2196F3', '#42A5F5'] as const;

export const CATEGORIAS_ICONES: Record<string, string> = {
  'Alimentacao': 'fast-food',
  'Transporte': 'car',
  'Moradia': 'home',
  'Lazer': 'game-controller',
  'Saude': 'medkit',
  'Educacao': 'school',
  'Vestuario': 'shirt',
  'Servicos': 'construct',
  'Outros': 'ellipsis-horizontal',
};

export const METODOS_PAGAMENTO = [
  { valor: 'pix' as const, label: 'Pix' },
  { valor: 'debito' as const, label: 'Debito' },
  { valor: 'credito' as const, label: 'Credito' },
];
