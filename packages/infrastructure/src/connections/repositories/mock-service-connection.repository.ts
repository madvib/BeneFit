import { ServiceConnectionRepository } from '@bene/application/connections';
import { ServiceConnection } from '@bene/core/connections';
import { Result } from '@bene/core/shared';

// Mock repository for ServiceConnection domain entity
export class MockServiceConnectionRepository implements ServiceConnectionRepository {
  async findById(id: string): Promise<Result<ServiceConnection>> {
    const services = await this.getConnectedServices();
    const service = services.find((s) => s.id === id);

    if (!service) {
      return Result.fail(new Error('Service connection not found'));
    }

    return Result.ok(service);
  }

  async save(entity: ServiceConnection): Promise<Result<void>> {
    console.log(`${entity} saved`);
    // In a mock implementation, we just return success
    return Result.ok();
  }

  async delete(id: string): Promise<Result<void>> {
    console.log(`${id} deleted`);

    // In a mock implementation, we just return success
    return Result.ok();
  }

  async getConnectedServices(): Promise<ServiceConnection[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/services.json');

    const services: ServiceConnection[] = [];
    for (const dto of data.default) {
      const entityResult = ServiceConnection.create({
        id: dto.id.toString(),
        name: dto.name,
        description: dto.description,
        connected: dto.connected,
        logo: dto.logo,
        dataType: dto.dataType,
        lastSync: dto.lastSync ? new Date(dto.lastSync) : undefined,
      });

      if (entityResult.isSuccess) {
        services.push(entityResult.value);
      }
    }

    return services;
  }

  async connectService(id: string): Promise<void> {
    console.log(`${id} connected`);

    // In a mock implementation, we just return success
    return Promise.resolve();
  }

  async disconnectService(id: string): Promise<void> {
    console.log(`${id} disconnected`);

    // In a mock implementation, we just return success
    return Promise.resolve();
  }
}
