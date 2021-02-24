import { Connection, EntityTarget, Repository } from 'typeorm'

export default abstract class BaseService<T> {
  protected repository: Repository<T>

  constructor(db: Connection, target: EntityTarget<T>) {
    this.repository = db.getRepository(target)
  }

  abstract get(): Promise<T[] | undefined>
}
