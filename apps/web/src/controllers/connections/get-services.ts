'use server';

import { connectionsUseCases } from '@/providers/connections-use-cases';

// Define the return types for service connection data
export interface ServiceConnectionData {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  logo: string;
  dataType: string[];
  lastSync?: string;
}

interface GetServicesResult {
  success: boolean;
  data?: ServiceConnectionData[];
  error?: string;
}

export async function getServices(): Promise<GetServicesResult> {
  try {
    const result = await connectionsUseCases.getAvailableServicesUseCase.execute();

    if (result.isSuccess) {
      // Transform the ServiceConnection entities to plain objects for client consumption
      const transformedData = result.value.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        connected: service.connected,
        logo: service.logo,
        dataType: service.dataType,
        lastSync: service.lastSync,
      }));

      return {
        success: true,
        data: transformedData,
      };
    } else {
      console.error('Failed to fetch services:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch services',
      };
    }
  } catch (error) {
    console.error('Error in getServices controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

interface ConnectServiceInput {
  serviceId: string;
}

interface ConnectServiceResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function connectService(input: ConnectServiceInput): Promise<ConnectServiceResult> {
  try {
    const result = await connectionsUseCases.connectServiceUseCase.execute(input);

    if (result.isSuccess) {
      return {
        success: true,
        message: result.value.message
      };
    } else {
      console.error('Use case failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Failed to connect service'
      };
    }
  } catch (error) {
    console.error('Error in connectService controller:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

interface DisconnectServiceInput {
  serviceId: string;
}

interface DisconnectServiceResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function disconnectService(input: DisconnectServiceInput): Promise<DisconnectServiceResult> {
  try {
    const result = await connectionsUseCases.disconnectServiceUseCase.execute(input);

    if (result.isSuccess) {
      return {
        success: true,
        message: result.value.message
      };
    } else {
      console.error('Use case failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Failed to disconnect service'
      };
    }
  } catch (error) {
    console.error('Error in disconnectService controller:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}