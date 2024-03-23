import useDeployGasLimit from '@/features/counterfactual/hooks/useDeployGasLimit'
import * as onboard from '@/hooks/wallets/useOnboard'
import * as sdk from '@/services/tx/tx-sender/sdk'
import { safeTxBuilder } from '@/tests/builders/safeTx'
import * as protocolKit from '@safe-global/protocol-kit'
import * as protocolKitContracts from '@safe-global/protocol-kit/dist/src/contracts/safeDeploymentContracts'
import type Safe from '@safe-global/protocol-kit'

import { renderHook } from '@/tests/test-utils'
import { waitFor } from '@testing-library/react'
import type { OnboardAPI } from '@web3-onboard/core'
import { faker } from '@faker-js/faker'
import type { CompatibilityFallbackHandlerContract, SimulateTxAccessorContract } from '@safe-global/safe-core-sdk-types'

describe('useDeployGasLimit hook', () => {
  it('returns undefined in onboard is not initialized', () => {
    jest.spyOn(onboard, 'default').mockReturnValue(undefined)
    const { result } = renderHook(() => useDeployGasLimit())

    expect(result.current.gasLimit).toBeUndefined()
  })

  it('returns safe deployment gas estimation', async () => {
    const mockGas = '100'
    const mockOnboard = {} as OnboardAPI
    jest.spyOn(onboard, 'default').mockReturnValue(mockOnboard)
    jest.spyOn(sdk, 'getSafeSDKWithSigner').mockImplementation(jest.fn())
    const mockEstimateSafeDeploymentGas = jest
      .spyOn(protocolKit, 'estimateSafeDeploymentGas')
      .mockReturnValue(Promise.resolve(mockGas))

    const { result } = renderHook(() => useDeployGasLimit())

    await waitFor(() => {
      expect(mockEstimateSafeDeploymentGas).toHaveBeenCalled()
      expect(result.current.gasLimit?.safeDeploymentGas).toEqual(mockGas)
    })
  })

  it('does not estimate safeTxGas if there is no safeTx and returns 0 for them instead', async () => {
    const mockOnboard = {} as OnboardAPI
    jest.spyOn(onboard, 'default').mockReturnValue(mockOnboard)
    jest.spyOn(sdk, 'getSafeSDKWithSigner').mockImplementation(jest.fn())
    jest.spyOn(protocolKit, 'estimateSafeDeploymentGas').mockReturnValue(Promise.resolve('100'))

    const mockEstimateTxBaseGas = jest.spyOn(protocolKit, 'estimateTxBaseGas')
    const mockEstimateSafeTxGas = jest.spyOn(protocolKit, 'estimateSafeTxGas')

    const { result } = renderHook(() => useDeployGasLimit())

    await waitFor(() => {
      expect(mockEstimateTxBaseGas).not.toHaveBeenCalled()
      expect(mockEstimateSafeTxGas).not.toHaveBeenCalled()
      expect(result.current.gasLimit?.safeTxGas).toEqual(0n)
    })
  })

  it('returns the totalFee', async () => {
    const mockOnboard = {} as OnboardAPI
    jest.spyOn(onboard, 'default').mockReturnValue(mockOnboard)
    jest.spyOn(sdk, 'getSafeSDKWithSigner').mockResolvedValue({
      getContractManager: () =>
        ({
          contractNetworks: {},
        } as any),
      getContractVersion: () => Promise.resolve('1.3.0'),
      getEthAdapter: () => ({
        estimateGas: () => Promise.resolve('420000'),
        getSignerAddress: () => Promise.resolve(faker.finance.ethereumAddress()),
      }),
      createSafeDeploymentTransaction: () =>
        Promise.resolve({
          to: faker.finance.ethereumAddress(),
          value: '0',
          data: '0x1234',
        }),
      getAddress: () => Promise.resolve(faker.finance.ethereumAddress()),
      createTransactionBatch: () =>
        Promise.resolve({
          to: faker.finance.ethereumAddress(),
          value: '0',
          data: '0x2345',
        }),
    } as unknown as Safe)
    jest.spyOn(protocolKitContracts, 'getCompatibilityFallbackHandlerContract').mockResolvedValue({
      encode: () => '0x3456',
    } as unknown as CompatibilityFallbackHandlerContract)
    jest.spyOn(protocolKitContracts, 'getSimulateTxAccessorContract').mockResolvedValue({
      encode: () => '0x4567',
      getAddress: () => Promise.resolve(faker.finance.ethereumAddress()),
    } as unknown as SimulateTxAccessorContract)
    jest.spyOn(protocolKit, 'estimateSafeDeploymentGas').mockReturnValue(Promise.resolve('100'))
    jest.spyOn(protocolKit, 'estimateTxBaseGas').mockReturnValue(Promise.resolve('21000'))

    const safeTx = safeTxBuilder().build()
    const { result } = renderHook(() => useDeployGasLimit(safeTx))

    await waitFor(() => {
      expect(result.current.gasLimit?.totalGas).toEqual(420000n + 21000n - 20000n)
    })
  })
})
