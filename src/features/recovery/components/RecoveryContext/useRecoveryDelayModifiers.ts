import type { Delay } from '@gnosis.pm/zodiac'
import type { SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'

import { getRecoveryDelayModifiers } from '@/features/recovery/services/delay-modifier'
import useAsync from '@/hooks/useAsync'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useWeb3ReadOnly } from '@/hooks/wallets/web3'
import { getSpendingLimitModuleAddress } from '@/services/contracts/spendingLimitContracts'
import type { AsyncResult } from '@/hooks/useAsync'
import { useIsRecoverySupported } from '../../hooks/useIsRecoverySupported'

function isOnlySpendingLimitEnabled(chainId: string, modules: SafeInfo['modules']) {
  return modules?.length === 1 && modules[0].value === getSpendingLimitModuleAddress(chainId)
}

export function useRecoveryDelayModifiers(): AsyncResult<Delay[]> {
  const supportsRecovery = useIsRecoverySupported()
  const web3ReadOnly = useWeb3ReadOnly()
  const { safe, safeAddress } = useSafeInfo()

  return useAsync<Array<Delay>>(
    () => {
      // Don't fetch if only spending limit module is enabled
      if (
        supportsRecovery &&
        web3ReadOnly &&
        safe.modules &&
        safe.modules.length > 0 &&
        !isOnlySpendingLimitEnabled(safe.chainId, safe.modules)
      ) {
        return getRecoveryDelayModifiers(safe.chainId, safe.modules, web3ReadOnly)
      }
    },
    // Only fetch delay modifiers again if the chain or enabled modules of current Safe changes
    // Need to check length of modules array to prevent new request every time Safe info polls
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeAddress, safe.chainId, safe.modules?.length, web3ReadOnly, supportsRecovery],
    false,
  )
}
