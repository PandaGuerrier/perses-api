import type { ApplicationService } from '@adonisjs/core/types'
import env from '#start/env'
import * as fs from 'node:fs'
import net from 'node:net'

import Busted from '#internal/events/busted'

export default class SocketProvider {
  private server?: net.Server

  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    const path = env.get('SOCKET_PATH')

    if (fs.existsSync(path)) fs.unlinkSync(path)


    this.server = net.createServer((socket) => {
      socket.setEncoding('utf8')

      /**
       * A stream delivers chunks, not messages: a write can arrive split across
       * several chunks, or several writes coalesced into one. We buffer until a
       * newline delimits a complete message.
       */
      let buffer = ''

      socket.on('data', (chunk: string) => {
        buffer += chunk

        let index = buffer.indexOf('\n')

        while (index !== -1) {
          const line = buffer.slice(0, index).trim()
          buffer = buffer.slice(index + 1)
          index = buffer.indexOf('\n')

          if (!line) continue

          Busted.dispatch(line).catch((error) => {
            console.error(`Socket server failed to dispatch a message: ${error.message}`)
          })
        }
      })

      socket.on('error', (error) => {
        console.error(`Socket connection error: ${error.message}`)
      })
    })

    this.server.listen(path, () => {
      console.log(`[Socket] - listening on ${path}`)
    })
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    // close() unlinks the socket file itself; the unlink on start() is for a stale
    // file left behind by a crash.
    this.server?.close()
  }
}
