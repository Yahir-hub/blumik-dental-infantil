// HYRONIX_ENVIRONMENT is independent from NODE_ENV (staging builds are optimized).
export function guardEnvironment(env,config) {
 const stage=env.HYRONIX_ENVIRONMENT??'development';
 if(!['development','staging','production'].includes(stage))throw Error('INVALID_HYRONIX_ENVIRONMENT');
 const harness=env.HYRONIX_STAGING_HARNESS_ENABLED==='true'||!!env.HYRONIX_STAGING_API_MODE;
 if(stage!=='staging'&&harness)throw Error('STAGING_HARNESS_OUTSIDE_STAGING');
 if(stage==='production') {
  if(env.HYRONIX_STORE_DRIVER==='local')throw Error('PRODUCTION_REQUIRES_DURABLE_STORE');
  for(const name of ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SITE_URL','HYRONIX_CONTENT_API_URL','HYRONIX_STORE_URL','HYRONIX_STORE_NAMESPACE','HYRONIX_WEBHOOK_URL']) {
   if(/gtvwovlcotccpfgmhcas|staging|localhost|127\.0\.0\.1/i.test(env[name]??''))throw Error('PRODUCTION_USES_NONPRODUCTION_CONFIG_'+name);
  }
  if(config&&(config.vars?.HYRONIX_ENVIRONMENT!=='production'||/staging/.test(config.name)||config.vars?.HYRONIX_STAGING_HARNESS_ENABLED==='true'))throw Error('PRODUCTION_PROVIDER_CONFIG_MISMATCH');
  const serialized=JSON.stringify({env,config});
  for(const forbidden of ['gtvwovlcotccpfgmhcas','de160f978b3e4fcb927106159704c410','633eb158-1731-4adb-8321-2f07c15c6db5','hyronix-cms-staging','blumik-hyronix-staging','blumik-staging'])
    if(serialized.includes(forbidden))throw Error('PRODUCTION_CONTAINS_STAGING_RESOURCE');
 }
 return stage;
}
