export * from './census-service';
export * from './backend';

import { CensusService } from './census-service';
import { BackendService } from './backend';

export const SERVICE_PROVIDERS = [
    CensusService,
    BackendService
];
