import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/index': ExtractProps<(typeof import('../../app/auth/ui/pages/index.tsx'))['default']>
    'core/errors/not_found': ExtractProps<(typeof import('../../app/core/ui/pages/errors/not_found.tsx'))['default']>
    'core/errors/server_error': ExtractProps<(typeof import('../../app/core/ui/pages/errors/server_error.tsx'))['default']>
    'internal/index': ExtractProps<(typeof import('../../app/internal/ui/pages/index.tsx'))['default']>
    'public/index': ExtractProps<(typeof import('../../app/public/ui/pages/index.tsx'))['default']>
    'users/create': ExtractProps<(typeof import('../../app/users/ui/pages/create.tsx'))['default']>
    'users/edit': ExtractProps<(typeof import('../../app/users/ui/pages/edit.tsx'))['default']>
    'users/index': ExtractProps<(typeof import('../../app/users/ui/pages/index.tsx'))['default']>
    'users/invite': ExtractProps<(typeof import('../../app/users/ui/pages/invite.tsx'))['default']>
    'users/settings': ExtractProps<(typeof import('../../app/users/ui/pages/settings.tsx'))['default']>
  }
}
