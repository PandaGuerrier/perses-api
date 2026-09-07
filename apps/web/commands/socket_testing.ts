import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import env from '#start/env'
import net from 'node:net'

export default class SocketTesting extends BaseCommand {
  static commandName = 'socket:testing'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "SocketTesting"')

    const path = env.get("SOCKET_PATH")

    const client = net.createConnection(path)
    client.write('Ma ligne brute\n')
    client.end()
  }
}
