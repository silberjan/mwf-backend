import { BehaviorSubject, Observable } from 'rxjs'
import { filter, scan, shareReplay } from 'rxjs/operators'
import { IdentifiedWS } from 'src'
import { OPEN } from 'ws'
import { wss } from './app'

export interface LatLng {
  lat: number
  lng: number
}

export class FriendUpdate {
  id: string
  pointer?: LatLng
  status?: 'connected' | 'disconnected'
  center?: LatLng
  zoom?: number
  viewport?: {
    northEast: LatLng
    southWest: LatLng
  }
  constructor(existingId?: string) {
    this.id = existingId || Math.floor(Math.random() * 1000).toString()
    this.status = 'connected'
  }
}

export class MapSyncService {
  friendUpdates$ = new BehaviorSubject<FriendUpdate>(null)

  state$: Observable<{ [id: string]: FriendUpdate }> = this.friendUpdates$.pipe(
    filter((p) => !!p),
    scan((acc, participant) => {
      const existing = acc[participant.id] || {}
      return { ...acc, [participant.id]: { ...existing, ...participant } }
    }, {} as { [id: string]: FriendUpdate }),
    shareReplay(1)
  )

  constructor() {
    this.friendUpdates$.subscribe((update) => {
      wss.clients.forEach((ws: IdentifiedWS) => {
        if (ws.readyState === OPEN && ws.id !== update.id) {
          // send updates only to others
          ws.send(JSON.stringify(update))
        }
      })
    })
  }

  addOrUpdateParticipant(update: FriendUpdate): void {
    console.log('UPDATE', update)
    this.friendUpdates$.next({ ...update, status: 'connected' })
  }

  disconnectParticipant(id: string) {
    console.log('DISCONNECT', id)
    this.friendUpdates$.next({ id, status: 'disconnected' })
  }
}

export const mapSyncService = new MapSyncService()
