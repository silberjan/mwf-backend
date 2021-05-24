import { take } from 'rxjs/operators'
import * as WebSocket from 'ws'
import { wss } from './app'
import { mapSyncService, FriendUpdate } from './map-sync.service'

export type IdentifiedWS = WebSocket & { id: string }

console.log(`Starting WSS`)

wss.on('connection', (ws: IdentifiedWS) => {
  ws.on('message', (message: string) => {
    try {
      const parsedMessage: FriendUpdate = JSON.parse(message)
      if (parsedMessage.id) {
        ws.id = parsedMessage.id
      }
      if (!ws.id) {
        throw new Error('Could not identify participant')
      }
      mapSyncService.addOrUpdateParticipant({ ...parsedMessage, id: ws.id })
    } catch (e) {
      console.log('Error parsing incoming message')
    }
  })

  ws.on('close', () => {
    if (ws.id) {
      mapSyncService.disconnectParticipant(ws.id)
    }
  })

  // mapSyncService.state$.pipe(take(1)).subscribe((state) => {
  //   ws.send(JSON.stringify(state))
  // })
})
