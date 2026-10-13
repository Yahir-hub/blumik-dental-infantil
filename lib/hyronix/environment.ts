/** Server/build configuration only; does not alter production canonical URLs. */
export const isStaging = () => process.env.HYRONIX_ENVIRONMENT === 'staging';
