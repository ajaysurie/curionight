export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./lib/server-error-handler')
  }
}