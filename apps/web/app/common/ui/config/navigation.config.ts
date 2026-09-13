import type { SimpleTFunction } from '#common/ui/hooks/use_translation'

import {
  Building2,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  UsersRound,
} from 'lucide-react'

import type { NavMainItem, NavUserOptionsGroup } from '#common/ui/types/navigation'

export function getNavUser(t: SimpleTFunction): NavUserOptionsGroup[] {
  return [
    [
      {
        title: t('common.layout.navUser.settings'),
        url: '/settings',
        icon: Settings,
      },
      {
        title: t('common.layout.navUser.adminPanel'),
        url: '/users',
        icon: Shield,
        can: 'manageUsers',
      },
    ],
    [
      {
        title: t('common.layout.navUser.logout'),
        url: '/logout',
        icon: LogOut,
        method: 'post',
      },
    ],
  ]
}

export function getMainNav(t: SimpleTFunction): NavMainItem[] {
  return [
    {
      title: t('common.layout.navMain.dashboard'),
      url: '/dashboard',
    },
    {
      title: t('common.layout.navMain.schedule'),
      url: '/schedule',
      can: 'viewSchedule',
    },
  ]
}

/**
 * Every entry is gated by a `can` key, itself a projection of the permission
 * catalogue — so the sidebar reshapes itself for a student, a teacher, an admin
 * or a super-admin without a single role check here.
 */
export function getAdminNav(t: SimpleTFunction): NavMainItem[] {
  return [
    {
      title: t('common.layout.navMain.dashboard'),
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: t('common.layout.navMain.schedule'),
      url: '/schedule',
      icon: CalendarDays,
      can: 'viewSchedule',
    },
    {
      title: t('common.layout.navMain.organisation'),
      items: [
        {
          title: t('common.layout.navMain.schools'),
          url: '/schools',
          icon: Building2,
          can: 'manageSchools',
        },
        {
          title: t('common.layout.navMain.groups'),
          url: '/groups',
          icon: UsersRound,
          can: 'manageGroups',
        },
        {
          title: t('common.layout.navMain.exams'),
          url: '/exams',
          icon: GraduationCap,
          can: 'manageExams',
        },
      ],
    },
    {
      title: t('common.layout.navMain.administration'),
      items: [
        {
          title: t('common.layout.navMain.users'),
          url: '/users',
          icon: Users,
          can: 'manageUsers',
        },
        {
          title: t('common.layout.navMain.roles'),
          url: '/roles',
          icon: ShieldCheck,
          can: 'manageRoles',
        },
      ],
    },
  ]
}
