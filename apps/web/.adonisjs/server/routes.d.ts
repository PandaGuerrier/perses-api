import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'public.index': { paramsTuple?: []; params?: {} }
    'locale.switch': { paramsTuple: [ParamValue]; params: {'locale': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.index': { paramsTuple?: []; params?: {} }
    'roles.create': { paramsTuple?: []; params?: {} }
    'roles.store': { paramsTuple?: []; params?: {} }
    'roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'tokens.store': { paramsTuple?: []; params?: {} }
    'tokens.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.index': { paramsTuple?: []; params?: {} }
    'auth.ferriskey.redirect': { paramsTuple?: []; params?: {} }
    'auth.ferriskey.callback': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'exams.index': { paramsTuple?: []; params?: {} }
    'exams.create': { paramsTuple?: []; params?: {} }
    'exams.store': { paramsTuple?: []; params?: {} }
    'exams.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schedule.show': { paramsTuple?: []; params?: {} }
    'schools.index': { paramsTuple?: []; params?: {} }
    'schools.create': { paramsTuple?: []; params?: {} }
    'schools.store': { paramsTuple?: []; params?: {} }
    'schools.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.index': { paramsTuple?: []; params?: {} }
    'groups.create': { paramsTuple?: []; params?: {} }
    'groups.store': { paramsTuple?: []; params?: {} }
    'groups.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.students.sync': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.members.index': { paramsTuple: [ParamValue]; params: {'school_id': ParamValue} }
    'schools.members.store': { paramsTuple: [ParamValue]; params: {'school_id': ParamValue} }
    'schools.members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'school_id': ParamValue,'id': ParamValue} }
    'schools.invitations.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'school_id': ParamValue,'id': ParamValue} }
    'dashboard.show': { paramsTuple?: []; params?: {} }
    'internal.index': { paramsTuple?: []; params?: {} }
    'event_stream': { paramsTuple?: []; params?: {} }
    'subscribe': { paramsTuple?: []; params?: {} }
    'unsubscribe': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'public.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.index': { paramsTuple?: []; params?: {} }
    'roles.create': { paramsTuple?: []; params?: {} }
    'roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'auth.index': { paramsTuple?: []; params?: {} }
    'auth.ferriskey.redirect': { paramsTuple?: []; params?: {} }
    'auth.ferriskey.callback': { paramsTuple?: []; params?: {} }
    'exams.index': { paramsTuple?: []; params?: {} }
    'exams.create': { paramsTuple?: []; params?: {} }
    'exams.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schedule.show': { paramsTuple?: []; params?: {} }
    'schools.index': { paramsTuple?: []; params?: {} }
    'schools.create': { paramsTuple?: []; params?: {} }
    'schools.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.index': { paramsTuple?: []; params?: {} }
    'groups.create': { paramsTuple?: []; params?: {} }
    'groups.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.members.index': { paramsTuple: [ParamValue]; params: {'school_id': ParamValue} }
    'dashboard.show': { paramsTuple?: []; params?: {} }
    'internal.index': { paramsTuple?: []; params?: {} }
    'event_stream': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'public.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.index': { paramsTuple?: []; params?: {} }
    'roles.create': { paramsTuple?: []; params?: {} }
    'roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'auth.index': { paramsTuple?: []; params?: {} }
    'auth.ferriskey.redirect': { paramsTuple?: []; params?: {} }
    'auth.ferriskey.callback': { paramsTuple?: []; params?: {} }
    'exams.index': { paramsTuple?: []; params?: {} }
    'exams.create': { paramsTuple?: []; params?: {} }
    'exams.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schedule.show': { paramsTuple?: []; params?: {} }
    'schools.index': { paramsTuple?: []; params?: {} }
    'schools.create': { paramsTuple?: []; params?: {} }
    'schools.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.index': { paramsTuple?: []; params?: {} }
    'groups.create': { paramsTuple?: []; params?: {} }
    'groups.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.members.index': { paramsTuple: [ParamValue]; params: {'school_id': ParamValue} }
    'dashboard.show': { paramsTuple?: []; params?: {} }
    'internal.index': { paramsTuple?: []; params?: {} }
    'event_stream': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'locale.switch': { paramsTuple: [ParamValue]; params: {'locale': ParamValue} }
    'users.store': { paramsTuple?: []; params?: {} }
    'roles.store': { paramsTuple?: []; params?: {} }
    'tokens.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'exams.store': { paramsTuple?: []; params?: {} }
    'schools.store': { paramsTuple?: []; params?: {} }
    'groups.store': { paramsTuple?: []; params?: {} }
    'schools.members.store': { paramsTuple: [ParamValue]; params: {'school_id': ParamValue} }
    'subscribe': { paramsTuple?: []; params?: {} }
    'unsubscribe': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.students.sync': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tokens.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'groups.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'school_id': ParamValue,'id': ParamValue} }
    'schools.invitations.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'school_id': ParamValue,'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}