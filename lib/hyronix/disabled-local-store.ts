/** Build alias for staging: node:sqlite must never enter a Worker bundle. */
export class LocalStore {
  constructor() { throw Error('LOCAL_STORE_DISABLED_IN_STAGING'); }
}
