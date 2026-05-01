

export abstract class BaseRepositoryPort<T> {
    abstract get(id: string): Promise<T | null>;
    abstract findAll(): Promise<T[]>;
    abstract save(model: T): Promise<T>;
    abstract delete(model: T): Promise<T>;
    abstract softDelete(model: T): Promise<T>;
}