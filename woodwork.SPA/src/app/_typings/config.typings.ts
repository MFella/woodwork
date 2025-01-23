export type EnvironmentPayload = {
  backendUrl: BackendUrl;
};

type AllowedUrlPrefixes = 'http' | 'https';
type BackendUrl<T extends AllowedUrlPrefixes = 'http'> = `${T}://${string}`;
