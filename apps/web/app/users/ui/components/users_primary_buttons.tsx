import { UserPlus } from 'lucide-react'
import { ModalLink } from 'adonis-inertia-modal/react'

import { buttonVariants } from '@workspace/ui/components/button'

import { urlFor } from '~/app/client'
import { useTranslation } from '#common/ui/hooks/use_translation'

export function UsersPrimaryButtons() {
  const { t } = useTranslation()

  return (
    <ModalLink href={urlFor('users.create')} className={buttonVariants({ size: 'sm' })}>
      <span>{t('users.index.toolbar.add')}</span>
      <UserPlus size={18} />
    </ModalLink>
  )
}
