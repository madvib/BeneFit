export interface ServiceMetadata {
  // User's profile in that service
  externalUserId?: string;
  externalUsername?: string;
  profileUrl?: string;

  // Service-specific data
  athleteType?: string; // For Strava: "runner", "cyclist", etc.
  units?: 'metric' | 'imperial';

  // Capabilities
  supportsWebhooks: boolean;
  webhookRegistered: boolean;
  webhookUrl?: string;
}

export function createServiceMetadata(props: Partial<ServiceMetadata>): ServiceMetadata {
  return {
    externalUserId: props.externalUserId,
    externalUsername: props.externalUsername,
    profileUrl: props.profileUrl,
    athleteType: props.athleteType,
    units: props.units,
    supportsWebhooks: props.supportsWebhooks ?? false,
    webhookRegistered: props.webhookRegistered ?? false,
    webhookUrl: props.webhookUrl
  };
}