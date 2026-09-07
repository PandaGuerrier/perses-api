import { BaseEvent } from '@adonisjs/core/events'

export default class Busted extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(public line: string) {
    super()
  }
}
