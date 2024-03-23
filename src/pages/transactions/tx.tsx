import type { NextPage } from 'next'
import Head from 'next/head'

import SingleTx from '@/components/transactions/SingleTx'
import Typography from '@mui/material/Typography'

const SingleTransaction: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Holesky Safe – Transaction details'}</title>
      </Head>

      <main>
        <Typography data-testid="tx-details" variant="h3" fontWeight={700} pt={1} mb={3}>
          Transaction details
        </Typography>

        <SingleTx />
      </main>
    </>
  )
}

export default SingleTransaction
