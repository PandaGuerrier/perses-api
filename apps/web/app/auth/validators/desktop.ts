import vine from '@vinejs/vine'

export const desktopRedirectValidator = vine.create({
  port: vine.number().withoutDecimals().range([1024, 65535]),
  challenge: vine
    .string()
    .fixedLength(43)
    .regex(/^[A-Za-z0-9_-]+$/),
})

export const desktopTokenValidator = vine.create({
  code: vine.string().maxLength(2048),
  verifier: vine.string().minLength(43).maxLength(128),
})
