import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './AppStateProvider'
import { useEffect } from 'react'
import { microstacksPerSTX } from '../lib/constants'
// import { useRouter } from 'next/router'
import { getRPCClient } from '../common/utils'
import { resolveSTXAddress } from '../common/use-stx-address'
import { useAuthContext } from './StacksAuthProvider'
import { initiateConnectionAddressTransaction, initiateConnectionSubscribeBlocks } from '../common/websocket-tx-updater'
import TxStatus from '../components/TxStatus'

export const getBalance = async (address: string) => {
  const client = getRPCClient()
  const url = `${client.url}/extended/v1/address/${address}/balances`

  // console.log(url)
  const response = await fetch(url, { credentials: 'omit' })
  const data = await response.json()
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

  // console.log(contractAddress)
  const dasBalance = data.fungible_tokens[`${contractAddress}.das-token::das-token`]

  return {
    stx: Number(data.stx.balance / microstacksPerSTX),
    das: dasBalance ? Number(dasBalance.balance) : 0,
    // stx: Number(data.stx.balance) - Number(data.stx.locked),
    // das: Number(dasBalance) ? dasBalance.balance : 0,
  }
}

export default function AppMain({ Component, pageProps }: AppProps) {
  const { userSession } = useAuthContext()
  const { appState, setAppstate } = useAppContext()

  // const location = useRouter().asPath

  // Nicht sicher ob nötig
  useEffect(() => {
    console.log('useEffect #1 - appState')
    setAppstate((prevState) => ({ ...prevState, currentTxId: '', currentTxStatus: '' }))
    console.log(appState)
    // }, [location])
  }, [])

  const fetchBalance = async (address: string) => {
    const account = await getBalance(address)
    console.log(account)
    setAppstate((prevState) => ({
      ...prevState,
      balance: {
        stx: account.stx,
        das: account.das,
      },
    }))
  }

  useEffect(() => {
    console.log('useEffect #2')
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()

      const getData = async () => {
        try {
          const address = resolveSTXAddress(userData)
          initiateConnectionAddressTransaction(address, setAppstate)
          initiateConnectionSubscribeBlocks(address, appState, setAppstate)
          fetchBalance(address)
        } catch (error) {
          console.error(error)
        }
      }
      void getData()
    }
    //Runs only on the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRedirectAuth = async () => {
    console.log('handleRedirectAuth')
    if (userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn()
      fetchBalance(resolveSTXAddress(userData))
      setAppstate((prevState) => ({ ...prevState, userData }))
    }
  }

  useEffect(() => {
    console.log('useEffect #3 - handleRedirectAuth')
    void handleRedirectAuth()
    //Runs only on the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    // <TransactionToastProvider>
    <>
      <Toaster position="bottom-right" />
      <Layout>
        <Component {...pageProps} />
        <TxStatus />
      </Layout>
    </>
    // </TransactionToastProvider>
  )
}
