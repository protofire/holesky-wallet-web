import ExternalLink from '@/components/common/ExternalLink'
import LoadingSpinner, { SpinnerStatus } from '@/components/new-safe/create/steps/StatusStep/LoadingSpinner'
import { SafeCreationEvent } from '@/features/counterfactual/services/safeCreationEvents'
import type { UndeployedSafe } from '@/features/counterfactual/store/undeployedSafesSlice'
import { useCurrentChain } from '@/hooks/useChains'
import { getBlockExplorerLink } from '@/utils/chains'
import { Box, Typography } from '@mui/material'
import FailedIcon from '@/public/images/common/tx-failed.svg'

const getStep = (status: SafeCreationEvent) => {
  switch (status) {
    case SafeCreationEvent.PROCESSING:
    case SafeCreationEvent.RELAYING:
      return {
        description: 'We are activating your account',
        instruction: 'It can take some minutes to create your account, but you can check the progress below.',
      }
    case SafeCreationEvent.FAILED:
      return {
        description: "Your account couldn't be created",
        instruction:
          'The creation transaction was rejected by the connected wallet. You can retry or create an account from scratch.',
      }
    case SafeCreationEvent.REVERTED:
      return {
        description: "Your account couldn't be created",
        instruction: 'The creation transaction reverted. You can retry or create an account from scratch.',
      }
    case SafeCreationEvent.SUCCESS:
      return {
        description: 'Your Safe Account is being indexed..',
        instruction: 'The account will be ready for use shortly. Please do not leave this page.',
      }
    case SafeCreationEvent.INDEXED:
      return {
        description: 'Your Safe Account was successfully created!',
        instruction: '',
      }
  }
}

const StatusMessage = ({
  status,
  isError,
  pendingSafe,
}: {
  status: SafeCreationEvent
  isError: boolean
  pendingSafe: UndeployedSafe | undefined
}) => {
  const stepInfo = getStep(status)
  const chain = useCurrentChain()

  const isSuccess = status === SafeCreationEvent.SUCCESS
  const spinnerStatus = isSuccess ? SpinnerStatus.SUCCESS : SpinnerStatus.PROCESSING
  const explorerLink =
    chain && pendingSafe?.status.txHash ? getBlockExplorerLink(chain, pendingSafe.status.txHash) : undefined

  return (
    <>
      <Box data-testid="safe-status-info" paddingX={3} mt={3}>
        <Box width="160px" height="160px" display="flex" margin="auto">
          {isError ? <FailedIcon /> : <LoadingSpinner status={spinnerStatus} />}
        </Box>
        <Typography variant="h3" marginTop={2} fontWeight={700}>
          {stepInfo.description}
        </Typography>
      </Box>
      <Box maxWidth={390} margin="auto">
        {stepInfo.instruction && (
          <Typography variant="body2" my={2}>
            {stepInfo.instruction}
          </Typography>
        )}
        {!isError && explorerLink && <ExternalLink href={explorerLink.href}>Check Status</ExternalLink>}
      </Box>
    </>
  )
}

export default StatusMessage
