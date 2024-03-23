import FirstSteps from '@/components/dashboard/FirstSteps'
import useSafeInfo from '@/hooks/useSafeInfo'
import type { ReactElement } from 'react'
import dynamic from 'next/dynamic'
import { Grid } from '@mui/material'
import PendingTxsList from '@/components/dashboard/PendingTxs/PendingTxsList'
import Overview from '@/components/dashboard/Overview/Overview'
import { FeaturedApps } from '@/components/dashboard/FeaturedApps/FeaturedApps'
import SafeAppsDashboardSection from '@/components/dashboard/SafeAppsDashboardSection/SafeAppsDashboardSection'
import GovernanceSection from '@/components/dashboard/GovernanceSection/GovernanceSection'
import CreationDialog from '@/components/dashboard/CreationDialog'
import { useRouter } from 'next/router'
import { CREATION_MODAL_QUERY_PARM } from '../new-safe/create/logic'
import useRecovery from '@/features/recovery/hooks/useRecovery'
import { useIsRecoverySupported } from '@/features/recovery/hooks/useIsRecoverySupported'
const RecoveryHeader = dynamic(() => import('@/features/recovery/components/RecoveryHeader'))
const RecoveryWidget = dynamic(() => import('@/features/recovery/components/RecoveryWidget'))

const Dashboard = (): ReactElement => {
  const router = useRouter()
  const { safe } = useSafeInfo()
  const { [CREATION_MODAL_QUERY_PARM]: showCreationModal = '' } = router.query

  const supportsRecovery = useIsRecoverySupported()
  const [recovery] = useRecovery()
  const showRecoveryWidget = supportsRecovery && !recovery

  return (
    <>
      <Grid container spacing={3}>
        {supportsRecovery && <RecoveryHeader />}

        <Grid item xs={12}>
          <Overview />
        </Grid>

        <Grid item xs={12}>
          <FirstSteps />
        </Grid>

        {safe.deployed && (
          <>
            <Grid item xs={12} lg={6}>
              <PendingTxsList />
            </Grid>

            {showRecoveryWidget ? (
              <Grid item xs={12} lg={6}>
                <RecoveryWidget />
              </Grid>
            ) : null}

            <Grid item xs={12} lg={showRecoveryWidget ? 12 : 6}>
              <FeaturedApps stackedLayout={!showRecoveryWidget} />
            </Grid>

            <Grid item xs={12}>
              <GovernanceSection />
            </Grid>

            <Grid item xs={12}>
              <SafeAppsDashboardSection />
            </Grid>
          </>
        )}
      </Grid>
      {showCreationModal ? <CreationDialog /> : null}
    </>
  )
}

export default Dashboard
