import type { InertiaProps } from '#core/ui/types'
import type { Data } from '@generated/data'

import AuthenticatedLayout from '#common/ui/components/authenticated_layout'
import { TokensSection } from '#users/ui/components/tokens_section'

import useCan from '#common/ui/hooks/use_can'
import { useTranslation } from '#common/ui/hooks/use_translation'

import { Badge } from '@workspace/ui/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'

type PageProps = InertiaProps<{
  profile: Data.Users.User.Variants['forProfile']
  tokens: Data.Users.Token[]
  newToken: { name: string; value: string } | null
}>

export default function SettingsPage({ profile, tokens, newToken }: PageProps) {
  const { t } = useTranslation()
  const can = useCan()

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: t('users.layout.title') }]}>
      <div className="mx-auto w-full max-w-[840px] px-4 pt-8 pb-24 sm:px-6 lg:px-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t('users.layout.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('users.layout.description')}</p>
        </header>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{profile.fullName || profile.email}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="flex flex-wrap gap-1">
              {profile.roles.map((role) => (
                <Badge key={role} variant="secondary" className="capitalize">
                  {role.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {can.manageTokens && (
          <div className="mt-8">
            <TokensSection tokens={tokens} newToken={newToken} />
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
