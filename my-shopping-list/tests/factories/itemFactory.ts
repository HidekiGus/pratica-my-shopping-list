import prisma from '../../src/database';

export async function createItem() {
  const item = {
    title: 'Galaxy Z Fold 4',
    url: 'http://www.globo.com',
    description: 'Foldable phone',
    amount: 4,
  };

  return item;
}
