import React from 'react'
import { useRouter } from 'next/router'

import { LOAD_SAFE_CATEGORY } from '@/services/analytics'
import { Container, Grid, Typography } from '@mui/material'
import { CardStepper } from '@/components/new-safe/CardStepper'
import type { TxStepperProps } from '@/components/new-safe/CardStepper/useCardStepper'
import type { NamedAddress } from '@/components/new-safe/create/types'
import SetAddressStep from '@/components/new-safe/load/steps/SetAddressStep'
import { AppRoutes } from '@/config/routes'
import SafeOwnerStep from '@/components/new-safe/load/steps/SafeOwnerStep'
import SafeReviewStep from '@/components/new-safe/load/steps/SafeReviewStep'

export type LoadSafeFormData = NamedAddress & {
  threshold: number
  owners: NamedAddress[]
}

export const LoadSafeSteps: TxStepperProps<LoadSafeFormData>['steps'] = [
  {
    title: 'Name, address & network',
    subtitle: 'Paste the address of the Safe Account you want to add, select the network and choose a name.',
    render: (data, onSubmit, onBack, setStep) => (
      <SetAddressStep onSubmit={onSubmit} onBack={onBack} data={data} setStep={setStep} />
    ),
  },
  {
    title: 'Owners and confirmations',
    subtitle: 'Optional: Provide a name for each owner.',
    render: (data, onSubmit, onBack, setStep) => (
      <SafeOwnerStep onSubmit={onSubmit} onBack={onBack} data={data} setStep={setStep} />
    ),
  },
  {
    title: 'Review',
    subtitle: 'Confirm loading Safe Account',
    render: (data, onSubmit, onBack, setStep) => (
      <SafeReviewStep onSubmit={onSubmit} onBack={onBack} data={data} setStep={setStep} />
    ),
  },
]

export const loadSafeDefaultData = { threshold: -1, owners: [], address: '', name: '' }

const LoadSafe = ({ initialData }: { initialData?: TxStepperProps<LoadSafeFormData>['initialData'] }) => {
  const router = useRouter()

  const onClose = () => {
    router.push(AppRoutes.welcome.index)
  }

  const initialSafe = initialData ?? loadSafeDefaultData

  return (
    <Container data-testid="load-safe-form">
      <Grid container columnSpacing={3} mt={[2, null, 7]} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Typography variant="h2" pb={2}>
            Load Safe Account
          </Typography>
        </Grid>
        <Grid item xs={12} md={10} lg={8} order={[1, null, 0]}>
          <CardStepper
            // Populate initial data
            key={initialSafe.address}
            initialData={initialSafe}
            onClose={onClose}
            steps={LoadSafeSteps}
            eventCategory={LOAD_SAFE_CATEGORY}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default LoadSafe
