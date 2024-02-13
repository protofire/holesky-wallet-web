import { useMemo } from 'react'
import type { ReactElement } from 'react'

import { TxListGrid } from '@/components/transactions/TxList'
import { RecoveryListItem } from '@/features/recovery/components/RecoveryListItem'
import { useRecoveryQueue } from '@/features/recovery/hooks/useRecoveryQueue'
import { groupRecoveryTransactions } from '@/utils/tx-list'
import useTxQueue from '@/hooks/useTxQueue'
import { GroupedRecoveryListItems } from '../GroupedRecoveryListItems'
import { isRecoveryQueueItem } from '@/utils/transaction-guards'
import type { RecoveryQueueItem } from '@/features/recovery/services/recovery-state'

import labelCss from '@/components/transactions/GroupLabel/styles.module.css'

// Conditional hook
function _RecoveryList({ recoveryQueue }: { recoveryQueue: Array<RecoveryQueueItem> }): ReactElement {
  const queue = useTxQueue()

  const groupedItems = useMemo(() => {
    if (!queue?.page?.results || queue.page.results.length === 0) {
      return recoveryQueue
    }
    return groupRecoveryTransactions(queue.page.results, recoveryQueue)
  }, [queue, recoveryQueue])

  const transactions = useMemo(() => {
    return groupedItems.map((item, index) => {
      if (Array.isArray(item)) {
        return <GroupedRecoveryListItems items={item} key={index} />
      }

      if (isRecoveryQueueItem(item)) {
        return <RecoveryListItem item={item} key={item.transactionHash} />
      }

      // Will never have non-recovery transactions here
      return null
    })
  }, [groupedItems])

  return <TxListGrid>{transactions}</TxListGrid>
}

function LazyRecoveryList(): ReactElement | null {
  const recoveryQueue = useRecoveryQueue()

  if (recoveryQueue.length === 0) {
    return null
  }

  return (
    <>
      <div className={labelCss.container}>Pending recovery</div>

      <TxListGrid>
        <_RecoveryList recoveryQueue={recoveryQueue} />
      </TxListGrid>
    </>
  )
}

export default LazyRecoveryList
