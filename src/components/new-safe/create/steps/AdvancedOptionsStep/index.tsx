import { Button, MenuItem, Divider, Box, TextField, Stack, Skeleton, SvgIcon, Tooltip, Typography } from '@mui/material'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type { ReactElement } from 'react'

import type { StepRenderProps } from '@/components/new-safe/CardStepper/useCardStepper'
import type { NewSafeFormData } from '@/components/new-safe/create'
import useSyncSafeCreationStep from '@/components/new-safe/create/useSyncSafeCreationStep'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import layoutCss from '@/components/new-safe/create/styles.module.css'
import { type SafeVersion } from '@safe-global/safe-core-sdk-types'
import NumberField from '@/components/common/NumberField'
import { useCurrentChain } from '@/hooks/useChains'
import useAsync from '@/hooks/useAsync'
import { computeNewSafeAddress } from '../../logic'
import { getReadOnlyFallbackHandlerContract } from '@/services/contracts/safeContracts'
import EthHashInfo from '@/components/common/EthHashInfo'
import InfoIcon from '@/public/images/notifications/info.svg'
import useWallet from '@/hooks/wallets/useWallet'
import { isSmartContract } from '@/utils/wallets'

enum AdvancedOptionsFields {
  safeVersion = 'safeVersion',
  saltNonce = 'saltNonce',
}

export type AdvancedOptionsStepForm = {
  [AdvancedOptionsFields.safeVersion]: SafeVersion
  [AdvancedOptionsFields.saltNonce]: number
}

const ADVANCED_OPTIONS_STEP_FORM_ID = 'create-safe-advanced-options-step-form'

const AdvancedOptionsStep = ({ onSubmit, onBack, data, setStep }: StepRenderProps<NewSafeFormData>): ReactElement => {
  const wallet = useWallet()
  useSyncSafeCreationStep(setStep)
  const chain = useCurrentChain()

  const formMethods = useForm<AdvancedOptionsStepForm>({
    mode: 'onChange',
    defaultValues: data,
  })

  const { handleSubmit, control, watch, formState, getValues, register } = formMethods

  const selectedSafeVersion = watch(AdvancedOptionsFields.safeVersion)
  const selectedSaltNonce = watch(AdvancedOptionsFields.saltNonce)

  const [readOnlyFallbackHandlerContract] = useAsync(
    () => (chain ? getReadOnlyFallbackHandlerContract(selectedSafeVersion) : undefined),
    [chain, selectedSafeVersion],
  )

  const [predictedSafeAddress] = useAsync(async () => {
    if (!chain || !readOnlyFallbackHandlerContract || !wallet) {
      return undefined
    }
    return computeNewSafeAddress(
      wallet.provider,
      {
        safeAccountConfig: {
          owners: data.owners.map((owner) => owner.address),
          threshold: data.threshold,
          fallbackHandler: await readOnlyFallbackHandlerContract.getAddress(),
        },
        saltNonce: selectedSaltNonce.toString(),
      },
      chain,
      selectedSafeVersion,
    )
  }, [
    chain,
    data.owners,
    data.threshold,
    wallet,
    readOnlyFallbackHandlerContract,
    selectedSafeVersion,
    selectedSaltNonce,
  ])

  const [isDeployed] = useAsync(
    async () => (predictedSafeAddress ? await isSmartContract(predictedSafeAddress) : false),
    [predictedSafeAddress],
  )

  const isDisabled = !formState.isValid || Boolean(isDeployed)

  const handleBack = () => {
    const formData = getValues()
    onBack(formData)
  }

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data)

    // TODO: Tracking of advanced setup
  })

  return (
    <form data-testid="advanced-options-step-form" onSubmit={onFormSubmit} id={ADVANCED_OPTIONS_STEP_FORM_ID}>
      <FormProvider {...formMethods}>
        <Stack spacing={2}>
          <Box className={layoutCss.row}>
            <Typography variant="h4" fontWeight={700} display="inline-flex" alignItems="center" gap={1}>
              Safe version
              <Tooltip
                title="The threshold of a Safe Account specifies how many signers need to confirm a Safe Account transaction before it can be executed."
                arrow
                placement="top"
              >
                <span style={{ display: 'flex' }}>
                  <SvgIcon component={InfoIcon} inheritViewBox color="border" fontSize="small" />
                </span>
              </Tooltip>
            </Typography>
            <Typography variant="body2" mb={2}>
              Changes the used master copy and fallback handler of the Safe.
            </Typography>
            <Controller
              control={control}
              name="safeVersion"
              render={({ field }) => (
                <TextField select {...field} label="Safe version">
                  <MenuItem value="1.4.1">1.4.1 (latest)</MenuItem>
                  <MenuItem value="1.3.0">1.3.0</MenuItem>
                </TextField>
              )}
            />
          </Box>

          <Divider />
          <Box className={layoutCss.row}>
            <Typography variant="h4" fontWeight={700} display="inline-flex" alignItems="center" gap={1}>
              Salt nonce
              <Tooltip
                title="The salt nonce changes the predicted Safe address. It can be used to re-create a Safe from another chain or to create a specific Safe address"
                arrow
                placement="top"
              >
                <span style={{ display: 'flex' }}>
                  <SvgIcon component={InfoIcon} inheritViewBox color="border" fontSize="small" />
                </span>
              </Tooltip>
            </Typography>
            <Typography variant="body2" mb={2}>
              Impacts the derived Safe address
            </Typography>
            <NumberField
              {...register(AdvancedOptionsFields.saltNonce, {
                validate: async (value) => {
                  if (isNaN(value)) {
                    return 'Salt nonce must be a number'
                  }
                  if (value < 0) {
                    return 'Salt nonce must be positive'
                  }
                },
                required: true,
              })}
              label="Salt nonce"
              error={Boolean(formState.errors[AdvancedOptionsFields.saltNonce]) || Boolean(isDeployed)}
              helperText={
                formState.errors[AdvancedOptionsFields.saltNonce]?.message ?? Boolean(isDeployed)
                  ? 'The Safe is already deployed. Use a different salt nonce.'
                  : undefined
              }
            />
          </Box>
          <Box className={layoutCss.row}>
            <Typography variant="h4" fontWeight={700} mb={1}>
              New Safe address
            </Typography>
            {predictedSafeAddress ? (
              <EthHashInfo address={predictedSafeAddress} hasExplorer showCopyButton />
            ) : (
              <Skeleton />
            )}
          </Box>
          <Divider />
          <Box className={layoutCss.row}>
            <Box display="flex" flexDirection="row" justifyContent="space-between" gap={3}>
              <Button
                data-testid="back-btn"
                variant="outlined"
                size="small"
                onClick={handleBack}
                startIcon={<ArrowBackIcon fontSize="small" />}
              >
                Back
              </Button>
              <Button data-testid="next-btn" type="submit" variant="contained" size="stretched" disabled={isDisabled}>
                Next
              </Button>
            </Box>
          </Box>
        </Stack>
      </FormProvider>
    </form>
  )
}

export default AdvancedOptionsStep
