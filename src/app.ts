import { WS_PORT } from 'config'
import { Server } from 'ws'

export const wss = new Server({ port: WS_PORT })
wss.on('listening', () => {
  console.log('WS IS LISTENING ON', wss.options.port)
})
