import { describe, it, expect } from 'vitest';
import { Repository } from './repository';
import { Entity, Result } from './index';

// Create a concrete entity for testing
interface TestEntityProps {
  name: string;
}

class TestEntity extends Entity<TestEntityProps> {
  constructor(props: TestEntityProps, id: string) {
    super(props, id);
  }
}

// Create a test repository implementation
class TestRepository implements Repository<TestEntity> {
  private entities: Map<string, TestEntity> = new Map();

  async findById(id: string): Promise<Result<TestEntity>> {
    const entity = this.entities.get(id);
    if (!entity) {
      return Result.fail(new Error(`Entity with id ${id} not found`));
    }
    return Result.ok(entity);
  }

  async save(entity: TestEntity): Promise<Result<void>> {
    this.entities.set(entity.id, entity);
    return Result.ok();
  }

  async delete(id: string): Promise<Result<void>> {
    const exists = this.entities.has(id);
    if (!exists) {
      return Result.fail(new Error(`Entity with id ${id} not found`));
    }
    this.entities.delete(id);
    return Result.ok();
  }
}

describe('Repository interface', () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
  });

  describe('save', () => {
    it('should save an entity successfully', async () => {
      const entity = new TestEntity({ name: 'Test Entity' }, '123');
      const result = await repository.save(entity);

      expect(result.isSuccess).toBe(true);
    });
  });

  describe('findById', () => {
    it('should find an entity that was saved', async () => {
      const entity = new TestEntity({ name: 'Test Entity' }, '123');
      await repository.save(entity);

      const result = await repository.findById('123');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.id).toBe('123');
        expect(result.value['props'].name).toBe('Test Entity');
      }
    });

    it('should return failure when entity is not found', async () => {
      const result = await repository.findById('non-existent');

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Entity with id non-existent not found');
      }
    });
  });

  describe('delete', () => {
    it('should delete an entity successfully', async () => {
      const entity = new TestEntity({ name: 'Test Entity' }, '123');
      await repository.save(entity);

      const result = await repository.delete('123');

      expect(result.isSuccess).toBe(true);

      // Verify the entity is actually deleted
      const findResult = await repository.findById('123');
      expect(findResult.isFailure).toBe(true);
    });

    it('should return failure when trying to delete non-existent entity', async () => {
      const result = await repository.delete('non-existent');

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Entity with id non-existent not found');
      }
    });
  });

  it('should follow the Repository interface contract', () => {
    const repo: Repository<TestEntity> = {
      findById: async (id: string) => {
        return Result.ok(new TestEntity({ name: 'test' }, id));
      },
      save: async (entity: TestEntity) => {
        // This simulates saving the entity without actually storing it
        // Reference the entity param to avoid unused variable error
        if (entity === undefined) return Result.fail(new Error('No entity provided'));
        return Result.ok(undefined);
      },
      delete: async (id: string) => {
        // This simulates deleting an entity without actually checking if it exists
        // Reference the id param to avoid unused variable error
        if (id === undefined) return Result.fail(new Error('No id provided'));
        return Result.ok(undefined);
      }
    };

    expect(repo).toBeDefined();
    expect(typeof repo.findById).toBe('function');
    expect(typeof repo.save).toBe('function');
    expect(typeof repo.delete).toBe('function');
  });
});