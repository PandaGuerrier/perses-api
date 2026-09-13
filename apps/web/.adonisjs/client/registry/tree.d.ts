/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  public: {
    index: typeof routes['public.index']
  }
  locale: {
    switch: typeof routes['locale.switch']
  }
  users: {
    index: typeof routes['users.index']
    create: typeof routes['users.create']
    store: typeof routes['users.store']
    edit: typeof routes['users.edit']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  roles: {
    index: typeof routes['roles.index']
    create: typeof routes['roles.create']
    store: typeof routes['roles.store']
    edit: typeof routes['roles.edit']
    update: typeof routes['roles.update']
    destroy: typeof routes['roles.destroy']
  }
  settings: {
    index: typeof routes['settings.index']
  }
  tokens: {
    store: typeof routes['tokens.store']
    destroy: typeof routes['tokens.destroy']
  }
  auth: {
    index: typeof routes['auth.index']
    ferriskey: {
      redirect: typeof routes['auth.ferriskey.redirect']
      callback: typeof routes['auth.ferriskey.callback']
    }
    logout: typeof routes['auth.logout']
  }
  exams: {
    index: typeof routes['exams.index']
    create: typeof routes['exams.create']
    store: typeof routes['exams.store']
    edit: typeof routes['exams.edit']
    update: typeof routes['exams.update']
    destroy: typeof routes['exams.destroy']
  }
  schedule: {
    show: typeof routes['schedule.show']
  }
  schools: {
    index: typeof routes['schools.index']
    create: typeof routes['schools.create']
    store: typeof routes['schools.store']
    edit: typeof routes['schools.edit']
    update: typeof routes['schools.update']
    destroy: typeof routes['schools.destroy']
    members: {
      index: typeof routes['schools.members.index']
      store: typeof routes['schools.members.store']
      destroy: typeof routes['schools.members.destroy']
    }
    invitations: {
      destroy: typeof routes['schools.invitations.destroy']
    }
  }
  groups: {
    index: typeof routes['groups.index']
    create: typeof routes['groups.create']
    store: typeof routes['groups.store']
    show: typeof routes['groups.show']
    edit: typeof routes['groups.edit']
    update: typeof routes['groups.update']
    destroy: typeof routes['groups.destroy']
    students: {
      sync: typeof routes['groups.students.sync']
    }
  }
  dashboard: {
    show: typeof routes['dashboard.show']
  }
  internal: {
    index: typeof routes['internal.index']
  }
  eventStream: typeof routes['event_stream']
  subscribe: typeof routes['subscribe']
  unsubscribe: typeof routes['unsubscribe']
}
