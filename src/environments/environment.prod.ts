import { DEFAULT_CONFIG } from '../configs/production';

export const environment = {
  apiEndpoint: DEFAULT_CONFIG.apiEndpoint,
  frontEndUrl: DEFAULT_CONFIG.frontEndUrl,

  production: true,
  awsUrl: DEFAULT_CONFIG.awsUrl,
};
