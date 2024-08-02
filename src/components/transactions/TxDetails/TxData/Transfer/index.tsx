import EthHashInfo from '@/components/common/EthHashInfo'
import { TransferTx } from '@/components/transactions/TxInfo'
import { isTxQueued } from '@/utils/transaction-guards'
import type { TransactionStatus, Transfer } from '@safe-global/safe-gateway-typescript-sdk'
import { TransferDirection } from '@safe-global/safe-gateway-typescript-sdk'
import { Box, Typography } from '@mui/material'
import React from 'react'

import TransferActions from '@/components/transactions/TxDetails/TxData/Transfer/TransferActions'
import MaliciousTxWarning from '@/components/transactions/MaliciousTxWarning'
import { ImitationTransactionWarning } from '@/components/transactions/ImitationTransactionWarning'

type TransferTxInfoProps = {
  txInfo: Transfer
  txStatus: TransactionStatus
  trusted: boolean
  imitation: boolean
}

const TransferTxInfoMain = ({ txInfo, txStatus, trusted, imitation }: TransferTxInfoProps) => {
  const { direction } = txInfo

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
      <Typography>
        {direction === TransferDirection.INCOMING ? 'Received' : isTxQueued(txStatus) ? 'Send' : 'Sent'}{' '}
        <b>
          <TransferTx info={txInfo} withLogo={false} omitSign preciseAmount />
        </b>
        {direction === TransferDirection.INCOMING ? ' from:' : ' to:'}
      </Typography>
      {!trusted && !imitation && <MaliciousTxWarning />}
    </Box>
  )
}

const TransferTxInfo = ({ txInfo, txStatus, trusted, imitation }: TransferTxInfoProps) => {
  const address = txInfo.direction.toUpperCase() === TransferDirection.INCOMING ? txInfo.sender : txInfo.recipient

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <TransferTxInfoMain txInfo={txInfo} txStatus={txStatus} trusted={trusted} imitation={imitation} />

      <Box display="flex" alignItems="center" width="100%">
        <EthHashInfo
          address={address.value}
          name={address.name}
          customAvatar={address.logoUri}
          shortAddress={false}
          hasExplorer
          showCopyButton
          trusted={trusted && !imitation}
        >
          <TransferActions address={address.value} txInfo={txInfo} trusted={trusted} />
        </EthHashInfo>
      </Box>
      {imitation && <ImitationTransactionWarning />}
    </Box>
  )
}

export default TransferTxInfo
