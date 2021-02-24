import { Repository } from 'typeorm'

export async function clearDatabaseEntityTable<T>(repo: Repository<T>) {
  return await repo.remove(await repo.find())
}
