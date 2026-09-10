import { BaseTransformer } from '@adonisjs/core/transformers'
import Cheat from '#internal/models/cheat'
import UserTransformer from '#users/transformers/user_transformer'

export default class CheatsTransformer extends BaseTransformer<Cheat> {
  toObject() {
    this.resource.load('user')
    return {
      user: UserTransformer.transform(this.resource.user),
      domain: this.resource.domain,
      observed_at: this.resource.observedAt,
    }
  }
}
