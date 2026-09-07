/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
  'auth.index': {
    methods: ["GET","HEAD"],
    pattern: '/auth',
    tokens: [{"old":"/auth","type":0,"val":"auth","end":""}],
    types: placeholder as Registry['auth.index']['types'],
  },
  'public.index': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['public.index']['types'],
  },
  'internal.index': {
    methods: ["GET","HEAD"],
    pattern: '/internal',
    tokens: [{"old":"/internal","type":0,"val":"internal","end":""}],
    types: placeholder as Registry['internal.index']['types'],
  },
  'users.invite.show': {
    methods: ["GET","HEAD"],
    pattern: '/users/invite',
    tokens: [{"old":"/users/invite","type":0,"val":"users","end":""},{"old":"/users/invite","type":0,"val":"invite","end":""}],
    types: placeholder as Registry['users.invite.show']['types'],
  },
  'users.invite.handle': {
    methods: ["POST"],
    pattern: '/users/invite',
    tokens: [{"old":"/users/invite","type":0,"val":"users","end":""},{"old":"/users/invite","type":0,"val":"invite","end":""}],
    types: placeholder as Registry['users.invite.handle']['types'],
  },
  'users.impersonate.handle': {
    methods: ["POST"],
    pattern: '/users/impersonate/:id',
    tokens: [{"old":"/users/impersonate/:id","type":0,"val":"users","end":""},{"old":"/users/impersonate/:id","type":0,"val":"impersonate","end":""},{"old":"/users/impersonate/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.impersonate.handle']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.create': {
    methods: ["GET","HEAD"],
    pattern: '/users/create',
    tokens: [{"old":"/users/create","type":0,"val":"users","end":""},{"old":"/users/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['users.create']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.edit': {
    methods: ["GET","HEAD"],
    pattern: '/users/:id/edit',
    tokens: [{"old":"/users/:id/edit","type":0,"val":"users","end":""},{"old":"/users/:id/edit","type":1,"val":"id","end":""},{"old":"/users/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['users.edit']['types'],
  },
  'users.update': {
    methods: ["PUT","PATCH"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'settings.index': {
    methods: ["GET","HEAD"],
    pattern: '/settings',
    tokens: [{"old":"/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings.index']['types'],
  },
  'profile.update': {
    methods: ["PUT"],
    pattern: '/settings/profile',
    tokens: [{"old":"/settings/profile","type":0,"val":"settings","end":""},{"old":"/settings/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.update']['types'],
  },
  'password.update': {
    methods: ["PUT"],
    pattern: '/settings/password',
    tokens: [{"old":"/settings/password","type":0,"val":"settings","end":""},{"old":"/settings/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['password.update']['types'],
  },
  'tokens.destroy': {
    methods: ["DELETE"],
    pattern: '/settings/tokens/:id',
    tokens: [{"old":"/settings/tokens/:id","type":0,"val":"settings","end":""},{"old":"/settings/tokens/:id","type":0,"val":"tokens","end":""},{"old":"/settings/tokens/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tokens.destroy']['types'],
  },
  'tokens.store': {
    methods: ["POST"],
    pattern: '/settings/tokens',
    tokens: [{"old":"/settings/tokens","type":0,"val":"settings","end":""},{"old":"/settings/tokens","type":0,"val":"tokens","end":""}],
    types: placeholder as Registry['tokens.store']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
