import env from '#start/env'
import { defineConfig } from '@adonisjs/ally'
import type { InferSocialProviders } from '@adonisjs/ally/types'
import { OidcService } from '@workspace/oidc-ally'

const allyConfig = defineConfig({
  ferriskey: OidcService({
    issuer: env.get('FERRISKEY_ISSUER'),
    clientId: env.get('FERRISKEY_CLIENT_ID'),
    clientSecret: env.get('FERRISKEY_CLIENT_SECRET'),
    callbackUrl: env.get('FERRISKEY_CALLBACK_URL'),
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
