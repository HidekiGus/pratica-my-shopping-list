import prisma from '../src/database';
import supertest from 'supertest';
import app from '../src/app';
import { createItem } from './factories/itemFactory';

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const item = await createItem();
    const body = {
      title: item.title,
      url: item.url,
      description: item.description,
      amount: item.amount,
    };
    const result = await supertest(app).post('/items').send(body);
    const status = result.status;

    expect(status).toEqual(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const item = await createItem();
    const body = {
      title: item.title,
      url: item.url,
      description: item.description,
      amount: item.amount,
    };
    const result = await supertest(app).post('/items').send(body);
    const status = result.status;

    expect(status).toEqual(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const result = await supertest(app).get('/items');

    expect(result.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const result = await supertest(app).get('/items/26');
    const item = await createItem();
    delete result.body.id;
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(item);
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const result = await supertest(app).get('/items/1');

    expect(result.status).toEqual(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
