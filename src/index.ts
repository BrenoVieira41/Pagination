import 'reflect-metadata';
import express, { Request, Response, Router } from 'express';
import { config } from 'dotenv';
import { AppDataSource } from './database/data-source';
import { Movies } from './database/Movies';
import { MoviesCreateQuery } from './Movies.sql';
import { OrderByEnum, OrderEnum, Pagination } from './interface';
import { ILike } from 'typeorm';

config();

const app = express();
const router = Router();

const port = process.env.PORT || 3333;
app.use(express.json());

const moviesDatabase = AppDataSource.getRepository(Movies);

function validateFields(data: Pagination) {
  let { limit, offset, order, orderby, search } = data;
  const numberRegex = new RegExp(/^[0-9]+$/);

  offset = numberRegex.test(String(offset)) ? Number(offset) : 0;
  limit = numberRegex.test(String(limit)) ? Number(limit) : 30;

  if (search !== undefined || '') {
    offset = 0
    limit = 30;
  }

  if (!order || !Object.keys(OrderEnum).includes(order.toUpperCase())) {
    order = OrderEnum.ASC
  }

  if (!orderby || !Object.keys(OrderByEnum).includes(orderby.toLocaleLowerCase())) {
    orderby = OrderByEnum.nome
  }

  search = search || ''
  return { offset, limit, order, orderby, search };
}

router.get('/movies/orm', async (req: Request, res: Response) => {
  const values = validateFields(req.query);

  try {
    const findMovies = await moviesDatabase.find({
      take: values.limit,
      skip: values.offset,
      order: { [values.orderby]: values.order },
      where: { nome: ILike(`%${values.search}%`) },
    });
    const total = findMovies.length;
    return res.status(200).send({ encontrados: total, filmes: findMovies });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send('Falha ao encontrar filme, valide novamente os parâmetros de busca');
  }

});

router.get('/movies/code', async (req: Request, res: Response) => {
  const values = validateFields(req.query);
  try {
    let findMovies = await moviesDatabase.find();
    findMovies = findMovies.slice(values.offset, values.limit); // passa de onde começa e termina.
    findMovies = findMovies.filter(it => it.nome.includes(values.search)  || it.lancamento.includes(values.search)); // Procura as palavras na string
    findMovies.sort((current, next) => { // Valida os campos possíveis de ordenação e o tipo da mesma.
      const currentName = current.nome.toUpperCase();
      const nextName = next.nome.toUpperCase();
      let validate = currentName < nextName ;
      if (values.orderby === OrderByEnum.nota) { validate = current.nota < next.nota };
      if (values.orderby === OrderByEnum.lancamento) { validate = current.lancamento < next.lancamento};
      if (values.order === OrderEnum.ASC) {
        if (validate) { // ordenando de forma ASC
          return -1
        }
        return 1;
      }
      if (!validate) { //ordenando de forma DESC
        return -1
      }
      return 1;
    });
    const total = findMovies.length;
    return res.status(200).send({ encontrados: total, filmes: findMovies });
  } catch (error) {
    console.log(error.message)
    return res.status(400).send('Falha ao encontrar filme, valide novamente os parâmetros de busca');
  }
});

app.use(router);

AppDataSource.initialize().then(async () => {
  const moviesDatabase = AppDataSource.getRepository(Movies);
  const validateDatabase = await moviesDatabase.count();

  if (validateDatabase < 1) {
    console.log('cadastrando os filmes');
    moviesDatabase.query('DELETE FROM movies;')
    moviesDatabase.query(MoviesCreateQuery);
  }

  app.listen(port, () => {
    console.log('Os dados esperados na busca são');
    console.log('limit, offset, order, orderby, search');
    console.log('limit = número de dados retornados');
    console.log('offset = a partir de qual será iniciado');
    console.log('orderby = campo que vem a ordenação');
    console.log('order = tipo de ordenação (ASC ou DESC)');
    console.log('search = nome do filme ou ano de lançamento do mesmo');
    console.log('-------------------------------------------------------');
    return console.log(`Server rodando na porta: ${port}`);
  });
});
