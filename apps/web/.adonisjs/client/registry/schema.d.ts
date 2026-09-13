/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'drive.fs.serve': {
    methods: ["GET","HEAD"]
    pattern: '/uploads/*'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { '*': ParamValue[] }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'public.index': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/public/controllers/public_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/public/controllers/public_controller').default['index']>>>
    }
  }
  'locale.switch': {
    methods: ["POST"]
    pattern: '/switch/:locale'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { locale: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'users.index': {
    methods: ["GET","HEAD"]
    pattern: '/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#users/validators/users').listUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.create': {
    methods: ["GET","HEAD"]
    pattern: '/users/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['create']>>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#users/validators/users').createUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#users/validators/users').createUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.edit': {
    methods: ["GET","HEAD"]
    pattern: '/users/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['edit']>>>
    }
  }
  'users.update': {
    methods: ["PUT","PATCH"]
    pattern: '/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#users/validators/users').editUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#users/validators/users').editUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.destroy': {
    methods: ["DELETE"]
    pattern: '/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/users_controller').default['destroy']>>>
    }
  }
  'roles.index': {
    methods: ["GET","HEAD"]
    pattern: '/roles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['index']>>>
    }
  }
  'roles.create': {
    methods: ["GET","HEAD"]
    pattern: '/roles/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['create']>>>
    }
  }
  'roles.store': {
    methods: ["POST"]
    pattern: '/roles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#users/validators/roles').createRoleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#users/validators/roles').createRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'roles.edit': {
    methods: ["GET","HEAD"]
    pattern: '/roles/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['edit']>>>
    }
  }
  'roles.update': {
    methods: ["PUT","PATCH"]
    pattern: '/roles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#users/validators/roles').updateRoleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#users/validators/roles').updateRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'roles.destroy': {
    methods: ["DELETE"]
    pattern: '/roles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/roles_controller').default['destroy']>>>
    }
  }
  'settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/settings_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/settings_controller').default['show']>>>
    }
  }
  'tokens.store': {
    methods: ["POST"]
    pattern: '/settings/tokens'
    types: {
      body: ExtractBody<InferInput<(typeof import('#users/validators/tokens').createTokenValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#users/validators/tokens').createTokenValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'tokens.destroy': {
    methods: ["DELETE"]
    pattern: '/settings/tokens/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/tokens_controller').default['destroy']>>>
    }
  }
  'auth.index': {
    methods: ["GET","HEAD"]
    pattern: '/auth'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['index']>>>
    }
  }
  'auth.ferriskey.redirect': {
    methods: ["GET","HEAD"]
    pattern: '/auth/ferriskey/redirect'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['redirect']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['redirect']>>>
    }
  }
  'auth.ferriskey.callback': {
    methods: ["GET","HEAD"]
    pattern: '/auth/ferriskey/callback'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['callback']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['callback']>>>
    }
  }
  'auth.logout': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['logout']>>>
    }
  }
  'exams.index': {
    methods: ["GET","HEAD"]
    pattern: '/exams'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#exam/validators/exams').listExamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'exams.create': {
    methods: ["GET","HEAD"]
    pattern: '/exams/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['create']>>>
    }
  }
  'exams.store': {
    methods: ["POST"]
    pattern: '/exams'
    types: {
      body: ExtractBody<InferInput<(typeof import('#exam/validators/exams').createExamValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#exam/validators/exams').createExamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'exams.edit': {
    methods: ["GET","HEAD"]
    pattern: '/exams/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['edit']>>>
    }
  }
  'exams.update': {
    methods: ["PUT","PATCH"]
    pattern: '/exams/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#exam/validators/exams').editExamValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#exam/validators/exams').editExamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'exams.destroy': {
    methods: ["DELETE"]
    pattern: '/exams/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/exam/controllers/exams_controller').default['destroy']>>>
    }
  }
  'schedule.show': {
    methods: ["GET","HEAD"]
    pattern: '/schedule'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/exam/controllers/schedule_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/exam/controllers/schedule_controller').default['show']>>>
    }
  }
  'schools.index': {
    methods: ["GET","HEAD"]
    pattern: '/schools'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#schools/validators/schools').listSchoolValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.create': {
    methods: ["GET","HEAD"]
    pattern: '/schools/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['create']>>>
    }
  }
  'schools.store': {
    methods: ["POST"]
    pattern: '/schools'
    types: {
      body: ExtractBody<InferInput<(typeof import('#schools/validators/schools').createSchoolValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#schools/validators/schools').createSchoolValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.edit': {
    methods: ["GET","HEAD"]
    pattern: '/schools/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['edit']>>>
    }
  }
  'schools.update': {
    methods: ["PUT","PATCH"]
    pattern: '/schools/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#schools/validators/schools').editSchoolValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#schools/validators/schools').editSchoolValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.destroy': {
    methods: ["DELETE"]
    pattern: '/schools/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/schools_controller').default['destroy']>>>
    }
  }
  'groups.index': {
    methods: ["GET","HEAD"]
    pattern: '/groups'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#schools/validators/groups').listGroupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'groups.create': {
    methods: ["GET","HEAD"]
    pattern: '/groups/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['create']>>>
    }
  }
  'groups.store': {
    methods: ["POST"]
    pattern: '/groups'
    types: {
      body: ExtractBody<InferInput<(typeof import('#schools/validators/groups').createGroupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#schools/validators/groups').createGroupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'groups.show': {
    methods: ["GET","HEAD"]
    pattern: '/groups/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['show']>>>
    }
  }
  'groups.edit': {
    methods: ["GET","HEAD"]
    pattern: '/groups/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['edit']>>>
    }
  }
  'groups.update': {
    methods: ["PUT","PATCH"]
    pattern: '/groups/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#schools/validators/groups').editGroupValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#schools/validators/groups').editGroupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'groups.destroy': {
    methods: ["DELETE"]
    pattern: '/groups/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['destroy']>>>
    }
  }
  'groups.students.sync': {
    methods: ["PUT"]
    pattern: '/groups/:id/students'
    types: {
      body: ExtractBody<InferInput<(typeof import('#schools/validators/groups').syncGroupStudentsValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#schools/validators/groups').syncGroupStudentsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['syncStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/groups_controller').default['syncStudents']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.members.index': {
    methods: ["GET","HEAD"]
    pattern: '/schools/:school_id/members'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { school_id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#schools/validators/members').listMemberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/members_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/members_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.members.store': {
    methods: ["POST"]
    pattern: '/schools/:school_id/members'
    types: {
      body: ExtractBody<InferInput<(typeof import('#schools/validators/members').inviteMemberValidator)>>
      paramsTuple: [ParamValue]
      params: { school_id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#schools/validators/members').inviteMemberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/members_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/members_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.members.destroy': {
    methods: ["DELETE"]
    pattern: '/schools/:school_id/members/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { school_id: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/members_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/members_controller').default['destroy']>>>
    }
  }
  'schools.invitations.destroy': {
    methods: ["DELETE"]
    pattern: '/schools/:school_id/invitations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { school_id: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/schools/controllers/members_controller').default['revokeInvitation']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/schools/controllers/members_controller').default['revokeInvitation']>>>
    }
  }
  'dashboard.show': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/dashboard/controllers/dashboard_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/dashboard/controllers/dashboard_controller').default['show']>>>
    }
  }
  'internal.index': {
    methods: ["GET","HEAD"]
    pattern: '/internal'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/internal/controllers/internal_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/internal/controllers/internal_controller').default['index']>>>
    }
  }
  'event_stream': {
    methods: ["GET","HEAD"]
    pattern: '/__transmit/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'subscribe': {
    methods: ["POST"]
    pattern: '/__transmit/subscribe'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'unsubscribe': {
    methods: ["POST"]
    pattern: '/__transmit/unsubscribe'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
}
