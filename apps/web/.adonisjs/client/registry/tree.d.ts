/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  auth: {
    index: typeof routes['auth.index']
  }
  public: {
    index: typeof routes['public.index']
  }
  internal: {
    index: typeof routes['internal.index']
  }
  users: {
    invite: {
      show: typeof routes['users.invite.show']
      handle: typeof routes['users.invite.handle']
    }
    impersonate: {
      handle: typeof routes['users.impersonate.handle']
    }
    index: typeof routes['users.index']
    create: typeof routes['users.create']
    store: typeof routes['users.store']
    edit: typeof routes['users.edit']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  settings: {
    index: typeof routes['settings.index']
  }
  profile: {
    update: typeof routes['profile.update']
  }
  password: {
    update: typeof routes['password.update']
  }
  tokens: {
    destroy: typeof routes['tokens.destroy']
    store: typeof routes['tokens.store']
  }
}
