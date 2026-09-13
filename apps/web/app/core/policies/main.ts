/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  // Identity
  UserPolicy: () => import('#users/policies/user_policy'),
  RolePolicy: () => import('#users/policies/role_policy'),
  TokenPolicy: () => import('#users/policies/token_policy'),

  // Organisation
  SchoolPolicy: () => import('#schools/policies/school_policy'),
  GroupPolicy: () => import('#schools/policies/group_policy'),
  MemberPolicy: () => import('#schools/policies/member_policy'),

  // Exams
  ExamPolicy: () => import('#exam/policies/exam_policy'),
}
