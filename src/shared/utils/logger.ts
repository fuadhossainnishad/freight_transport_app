const isDev = __DEV__

export const logger = {
    info: (...args: unknown[]) => isDev && console.log('[INFO]', ...args),
    warn: (...args: unknown[]) => isDev && console.warn('[WARN]', ...args),
    error: (...args: unknown[]) => isDev && console.error('[ERROR]', ...args),
}