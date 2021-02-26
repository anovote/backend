import { ElectionOrganizer } from '@/models/ElectionOrganizer/ElectionOrganizerEntity'
import { Connection, EntityTarget, Repository } from 'typeorm'

/**
 * Base entity service represents basic operations that a service class should preform
 * @template T is the typeof entity that the service handles
 */
export default abstract class BaseEntityService<T> {
  protected repository: Repository<T>

  constructor(db: Connection, target: EntityTarget<T>) {
    this.repository = db.getRepository(target)
  }

  /**
   * Gets all entities that are available
   * @returns an array of entities
   */
  abstract get(): Promise<T[] | undefined>

  /**
   * Gets a single entity if it exists
   * @param id the id of the entity to get
   */
  abstract getById(id: number): Promise<T | undefined>

  /**
   * Creates a new entity in the database
   * @param dto The Data transfer object of an entity containing all necessary dat
   */
  abstract create(dto: T, options?: CrudOptions): Promise<T | undefined>

  /**
   * Updates an entity in the database
   * @param id the id of the entity to update
   * @param dto the data transfer object contain the data to be updated
   * @returns the updated entity if the entity existed
   */
  abstract update(id: number, dto: T): Promise<T | undefined>

  /**
   * Deletes the entity if it exists in the database
   * @param id the id of the entity
   * @returns nothing
   */
  abstract delete(id: number): Promise<void>
}

export interface CrudOptions {
  parentId?: number
}
