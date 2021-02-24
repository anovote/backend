import { Connection, EntityTarget, Repository } from 'typeorm'

export default abstract class BaseService<T> {
  protected repository: Repository<T>

  constructor(db: Connection, target: EntityTarget<T>) {
    this.repository = db.getRepository(target)
  }

  abstract get(): Promise<T[] | undefined>

  abstract getById(id: number): Promise<T | undefined>

  abstract post(dto: T): Promise<T | undefined>

  abstract put(id: number, dto: T): Promise<T | undefined>

  abstract delete(id: number): Promise<void>
}
