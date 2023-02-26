export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum OrderByEnum {
  nome = 'nome',
  lancamento = 'lancamento',
  nota = 'nota'
}

export interface Pagination {
  limit?: number | string,
  offset?: number | string,
  search?: string,
  orderby?:  OrderByEnum,
  order?: OrderEnum
}
