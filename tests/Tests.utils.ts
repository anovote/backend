import { Repository } from 'typeorm'

export async function clearDatabaseEntityTable<T>(entityRepository: Repository<T>) {
  return await entityRepository.remove(await entityRepository.find())
}
