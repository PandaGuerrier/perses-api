import { BaseTransformer } from '@adonisjs/core/transformers'

import type Cheat from '#internal/models/cheat'

export default class CheatsTransformer extends BaseTransformer<Cheat> {
  toObject() {
    return {
      id: this.resource.uuid,
      userId: this.resource.userUuid,
      domain: this.resource.domain,
      observedAt: this.resource.observedAt?.toISO() ?? null,
    }
  }
}
