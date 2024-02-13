import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { TxModalContext } from '@/components/tx-flow'
import { AddOwnerFlow } from '@/components/tx-flow/flows'
import { AppRoutes } from '@/config/routes'

const AddOwner: NextPage = () => {
  const router = useRouter()
  const { address } = router.query
  const ownerAddress = Array.isArray(address) ? address[0] : address
  const { setTxFlow } = useContext(TxModalContext)

  useEffect(() => {
    router.push({ pathname: AppRoutes.settings.setup, query: router.query }).then(() => {
      if (!ownerAddress) return

      setTxFlow(<AddOwnerFlow address={ownerAddress} />)
    })
  }, [ownerAddress, router, setTxFlow])

  return (
    <>
      <Head>
        <title>{'Holesky Safe – Add Owner'}</title>
      </Head>
    </>
  )
}

export default AddOwner
