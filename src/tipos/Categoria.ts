export type TipoCategoria = 'entrada' | 'saida';

export interface Categoria {
  id: number;
  nome: string;
  cor: string;
  icone: string | null;
  tipo: TipoCategoria;
  criado_em: string;
}
