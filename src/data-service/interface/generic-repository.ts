
export abstract class GenericRepositoryInterface<T> {
   abstract getAll(): Promise<T[]>;
   abstract getById(id: string): Promise<T>;
   abstract add(entity: T): Promise<T>;
   abstract updateById(id: string, entity: T): Promise<T>;
   abstract deleteById(id: string): void;
} 