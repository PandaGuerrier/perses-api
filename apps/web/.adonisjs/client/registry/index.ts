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
  'public.index': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['public.index']['types'],
  },
  'locale.switch': {
    methods: ["POST"],
    pattern: '/switch/:locale',
    tokens: [{"old":"/switch/:locale","type":0,"val":"switch","end":""},{"old":"/switch/:locale","type":1,"val":"locale","end":""}],
    types: placeholder as Registry['locale.switch']['types'],
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
  'roles.index': {
    methods: ["GET","HEAD"],
    pattern: '/roles',
    tokens: [{"old":"/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['roles.index']['types'],
  },
  'roles.create': {
    methods: ["GET","HEAD"],
    pattern: '/roles/create',
    tokens: [{"old":"/roles/create","type":0,"val":"roles","end":""},{"old":"/roles/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['roles.create']['types'],
  },
  'roles.store': {
    methods: ["POST"],
    pattern: '/roles',
    tokens: [{"old":"/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['roles.store']['types'],
  },
  'roles.edit': {
    methods: ["GET","HEAD"],
    pattern: '/roles/:id/edit',
    tokens: [{"old":"/roles/:id/edit","type":0,"val":"roles","end":""},{"old":"/roles/:id/edit","type":1,"val":"id","end":""},{"old":"/roles/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['roles.edit']['types'],
  },
  'roles.update': {
    methods: ["PUT","PATCH"],
    pattern: '/roles/:id',
    tokens: [{"old":"/roles/:id","type":0,"val":"roles","end":""},{"old":"/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['roles.update']['types'],
  },
  'roles.destroy': {
    methods: ["DELETE"],
    pattern: '/roles/:id',
    tokens: [{"old":"/roles/:id","type":0,"val":"roles","end":""},{"old":"/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['roles.destroy']['types'],
  },
  'settings.index': {
    methods: ["GET","HEAD"],
    pattern: '/settings',
    tokens: [{"old":"/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings.index']['types'],
  },
  'tokens.store': {
    methods: ["POST"],
    pattern: '/settings/tokens',
    tokens: [{"old":"/settings/tokens","type":0,"val":"settings","end":""},{"old":"/settings/tokens","type":0,"val":"tokens","end":""}],
    types: placeholder as Registry['tokens.store']['types'],
  },
  'tokens.destroy': {
    methods: ["DELETE"],
    pattern: '/settings/tokens/:id',
    tokens: [{"old":"/settings/tokens/:id","type":0,"val":"settings","end":""},{"old":"/settings/tokens/:id","type":0,"val":"tokens","end":""},{"old":"/settings/tokens/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tokens.destroy']['types'],
  },
  'auth.index': {
    methods: ["GET","HEAD"],
    pattern: '/auth',
    tokens: [{"old":"/auth","type":0,"val":"auth","end":""}],
    types: placeholder as Registry['auth.index']['types'],
  },
  'auth.ferriskey.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/auth/ferriskey/redirect',
    tokens: [{"old":"/auth/ferriskey/redirect","type":0,"val":"auth","end":""},{"old":"/auth/ferriskey/redirect","type":0,"val":"ferriskey","end":""},{"old":"/auth/ferriskey/redirect","type":0,"val":"redirect","end":""}],
    types: placeholder as Registry['auth.ferriskey.redirect']['types'],
  },
  'auth.ferriskey.callback': {
    methods: ["GET","HEAD"],
    pattern: '/auth/ferriskey/callback',
    tokens: [{"old":"/auth/ferriskey/callback","type":0,"val":"auth","end":""},{"old":"/auth/ferriskey/callback","type":0,"val":"ferriskey","end":""},{"old":"/auth/ferriskey/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['auth.ferriskey.callback']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'exams.index': {
    methods: ["GET","HEAD"],
    pattern: '/exams',
    tokens: [{"old":"/exams","type":0,"val":"exams","end":""}],
    types: placeholder as Registry['exams.index']['types'],
  },
  'exams.create': {
    methods: ["GET","HEAD"],
    pattern: '/exams/create',
    tokens: [{"old":"/exams/create","type":0,"val":"exams","end":""},{"old":"/exams/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['exams.create']['types'],
  },
  'exams.store': {
    methods: ["POST"],
    pattern: '/exams',
    tokens: [{"old":"/exams","type":0,"val":"exams","end":""}],
    types: placeholder as Registry['exams.store']['types'],
  },
  'exams.edit': {
    methods: ["GET","HEAD"],
    pattern: '/exams/:id/edit',
    tokens: [{"old":"/exams/:id/edit","type":0,"val":"exams","end":""},{"old":"/exams/:id/edit","type":1,"val":"id","end":""},{"old":"/exams/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['exams.edit']['types'],
  },
  'exams.update': {
    methods: ["PUT","PATCH"],
    pattern: '/exams/:id',
    tokens: [{"old":"/exams/:id","type":0,"val":"exams","end":""},{"old":"/exams/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['exams.update']['types'],
  },
  'exams.destroy': {
    methods: ["DELETE"],
    pattern: '/exams/:id',
    tokens: [{"old":"/exams/:id","type":0,"val":"exams","end":""},{"old":"/exams/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['exams.destroy']['types'],
  },
  'schedule.show': {
    methods: ["GET","HEAD"],
    pattern: '/schedule',
    tokens: [{"old":"/schedule","type":0,"val":"schedule","end":""}],
    types: placeholder as Registry['schedule.show']['types'],
  },
  'schools.index': {
    methods: ["GET","HEAD"],
    pattern: '/schools',
    tokens: [{"old":"/schools","type":0,"val":"schools","end":""}],
    types: placeholder as Registry['schools.index']['types'],
  },
  'schools.create': {
    methods: ["GET","HEAD"],
    pattern: '/schools/create',
    tokens: [{"old":"/schools/create","type":0,"val":"schools","end":""},{"old":"/schools/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['schools.create']['types'],
  },
  'schools.store': {
    methods: ["POST"],
    pattern: '/schools',
    tokens: [{"old":"/schools","type":0,"val":"schools","end":""}],
    types: placeholder as Registry['schools.store']['types'],
  },
  'schools.edit': {
    methods: ["GET","HEAD"],
    pattern: '/schools/:id/edit',
    tokens: [{"old":"/schools/:id/edit","type":0,"val":"schools","end":""},{"old":"/schools/:id/edit","type":1,"val":"id","end":""},{"old":"/schools/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['schools.edit']['types'],
  },
  'schools.update': {
    methods: ["PUT","PATCH"],
    pattern: '/schools/:id',
    tokens: [{"old":"/schools/:id","type":0,"val":"schools","end":""},{"old":"/schools/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['schools.update']['types'],
  },
  'schools.destroy': {
    methods: ["DELETE"],
    pattern: '/schools/:id',
    tokens: [{"old":"/schools/:id","type":0,"val":"schools","end":""},{"old":"/schools/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['schools.destroy']['types'],
  },
  'groups.index': {
    methods: ["GET","HEAD"],
    pattern: '/groups',
    tokens: [{"old":"/groups","type":0,"val":"groups","end":""}],
    types: placeholder as Registry['groups.index']['types'],
  },
  'groups.create': {
    methods: ["GET","HEAD"],
    pattern: '/groups/create',
    tokens: [{"old":"/groups/create","type":0,"val":"groups","end":""},{"old":"/groups/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['groups.create']['types'],
  },
  'groups.store': {
    methods: ["POST"],
    pattern: '/groups',
    tokens: [{"old":"/groups","type":0,"val":"groups","end":""}],
    types: placeholder as Registry['groups.store']['types'],
  },
  'groups.show': {
    methods: ["GET","HEAD"],
    pattern: '/groups/:id',
    tokens: [{"old":"/groups/:id","type":0,"val":"groups","end":""},{"old":"/groups/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['groups.show']['types'],
  },
  'groups.edit': {
    methods: ["GET","HEAD"],
    pattern: '/groups/:id/edit',
    tokens: [{"old":"/groups/:id/edit","type":0,"val":"groups","end":""},{"old":"/groups/:id/edit","type":1,"val":"id","end":""},{"old":"/groups/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['groups.edit']['types'],
  },
  'groups.update': {
    methods: ["PUT","PATCH"],
    pattern: '/groups/:id',
    tokens: [{"old":"/groups/:id","type":0,"val":"groups","end":""},{"old":"/groups/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['groups.update']['types'],
  },
  'groups.destroy': {
    methods: ["DELETE"],
    pattern: '/groups/:id',
    tokens: [{"old":"/groups/:id","type":0,"val":"groups","end":""},{"old":"/groups/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['groups.destroy']['types'],
  },
  'groups.students.sync': {
    methods: ["PUT"],
    pattern: '/groups/:id/students',
    tokens: [{"old":"/groups/:id/students","type":0,"val":"groups","end":""},{"old":"/groups/:id/students","type":1,"val":"id","end":""},{"old":"/groups/:id/students","type":0,"val":"students","end":""}],
    types: placeholder as Registry['groups.students.sync']['types'],
  },
  'schools.members.index': {
    methods: ["GET","HEAD"],
    pattern: '/schools/:school_id/members',
    tokens: [{"old":"/schools/:school_id/members","type":0,"val":"schools","end":""},{"old":"/schools/:school_id/members","type":1,"val":"school_id","end":""},{"old":"/schools/:school_id/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['schools.members.index']['types'],
  },
  'schools.members.store': {
    methods: ["POST"],
    pattern: '/schools/:school_id/members',
    tokens: [{"old":"/schools/:school_id/members","type":0,"val":"schools","end":""},{"old":"/schools/:school_id/members","type":1,"val":"school_id","end":""},{"old":"/schools/:school_id/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['schools.members.store']['types'],
  },
  'schools.members.destroy': {
    methods: ["DELETE"],
    pattern: '/schools/:school_id/members/:id',
    tokens: [{"old":"/schools/:school_id/members/:id","type":0,"val":"schools","end":""},{"old":"/schools/:school_id/members/:id","type":1,"val":"school_id","end":""},{"old":"/schools/:school_id/members/:id","type":0,"val":"members","end":""},{"old":"/schools/:school_id/members/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['schools.members.destroy']['types'],
  },
  'schools.invitations.destroy': {
    methods: ["DELETE"],
    pattern: '/schools/:school_id/invitations/:id',
    tokens: [{"old":"/schools/:school_id/invitations/:id","type":0,"val":"schools","end":""},{"old":"/schools/:school_id/invitations/:id","type":1,"val":"school_id","end":""},{"old":"/schools/:school_id/invitations/:id","type":0,"val":"invitations","end":""},{"old":"/schools/:school_id/invitations/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['schools.invitations.destroy']['types'],
  },
  'dashboard.show': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard.show']['types'],
  },
  'internal.index': {
    methods: ["GET","HEAD"],
    pattern: '/internal',
    tokens: [{"old":"/internal","type":0,"val":"internal","end":""}],
    types: placeholder as Registry['internal.index']['types'],
  },
  'event_stream': {
    methods: ["GET","HEAD"],
    pattern: '/__transmit/events',
    tokens: [{"old":"/__transmit/events","type":0,"val":"__transmit","end":""},{"old":"/__transmit/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['event_stream']['types'],
  },
  'subscribe': {
    methods: ["POST"],
    pattern: '/__transmit/subscribe',
    tokens: [{"old":"/__transmit/subscribe","type":0,"val":"__transmit","end":""},{"old":"/__transmit/subscribe","type":0,"val":"subscribe","end":""}],
    types: placeholder as Registry['subscribe']['types'],
  },
  'unsubscribe': {
    methods: ["POST"],
    pattern: '/__transmit/unsubscribe',
    tokens: [{"old":"/__transmit/unsubscribe","type":0,"val":"__transmit","end":""},{"old":"/__transmit/unsubscribe","type":0,"val":"unsubscribe","end":""}],
    types: placeholder as Registry['unsubscribe']['types'],
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
