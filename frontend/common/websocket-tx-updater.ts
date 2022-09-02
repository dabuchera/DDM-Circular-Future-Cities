import { connectWebSocketClient } from '@stacks/blockchain-api-client'
import {
  RpcAddressTxNotificationParams,
  Block,
  TransactionStatus,
  MempoolTransactionStatus,
} from '@stacks/stacks-blockchain-api-types'

import { Dispatch, SetStateAction } from 'react'
import { IAppState } from '../providers/AppStateProvider'
import { getBalance } from '../providers/MainContainer'

const env = process.env.REACT_APP_NETWORK_ENV || 'testnet'

// console.log(env)

let websocketUrl = 'wss://stacks-node-api.mainnet.stacks.co'
let coreApiUrl = 'https://stacks-node-api.mainnet.stacks.co'
if (env.includes('mocknet')) {
  websocketUrl = `ws://localhost:${process.env.LOCAL_STACKS_API_PORT}`
  coreApiUrl = `http://localhost:${process.env.LOCAL_STACKS_API_PORT}`
} else if (env.includes('testnet')) {
  coreApiUrl = 'https://stacks-node-api.testnet.stacks.co'
  websocketUrl = 'wss://stacks-node-api.testnet.stacks.co'
} else if (env.includes('regtest')) {
  coreApiUrl = 'https://stacks-node-api.regtest.stacks.co'
  websocketUrl = 'wss://stacks-node-api.regtest.stacks.co'
}

export const initiateConnectionAddressTransaction = async (
  address: string,
  setAppstate: Dispatch<SetStateAction<IAppState>>
) => {
  const client = await connectWebSocketClient(websocketUrl)
  client.subscribeAddressTransactions(address, (transactionInfo: RpcAddressTxNotificationParams) => {
    console.log('transactionInfo', transactionInfo)
    parseTransaction(transactionInfo, setAppstate)
  })
}

const parseTransaction = (update: RpcAddressTxNotificationParams, setAppstate: Dispatch<SetStateAction<IAppState>>) => {
  // console.log('parseTransaction')
  // console.log(update)
  const status: TransactionStatus | MempoolTransactionStatus = update.tx_status

  if (status == 'success') {
    setAppstate((prevState) => ({
      ...prevState,
      tx_status: 'success',
      currentTxMessage: 'In Microblock...',
    }))
  } else if (status === 'abort_by_response' || status === 'abort_by_post_condition') {
    // console.log(update.tx_status)
    const url = `${coreApiUrl}/extended/v1/tx/${update.tx_id}/?unanchored=true`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        let error = errToHumanReadable(data['tx_result']['repr'])
        if (error === 'An unknown error occurred. Please try again') {
          error = 'Post Condition Failed'
        }
        setAppstate((prevState) => ({
          ...prevState,
          tx_status: 'error',
          currentTxMessage: error,
        }))
      })
      .catch(console.error)
  }
  // For now remove and combined above
  // else if (status === 'abort_by_post_condition') {
  //   // console.log(update.tx_status)
  //   const url = `${coreApiUrl}/extended/v1/tx/${update.tx_id}/?unanchored=true`
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data)
  //       setAppstate((prevState) => ({
  //         ...prevState,
  //         tx_status: 'error',
  //         currentTxMessage: 'Post Condition Failed',
  //       }))
  //     })
  //     .catch(console.error)
  // }
}

const errToHumanReadable = (err: string) => {
  console.log(err)
  const errId = err.split('(err')[1].replace(/ /g, '').replace(')', '')
  if (errId === 'none') {
    return 'An unknown error occurred. Please try again'
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return errorMessages[errId] || errId
}

// Adding here all Err Codes
const errorMessages = {
  u1: 'You do not have enough balance to make this transaction',
  u401: 'Not Authorized',

  u100: 'Zero STX as Input',
  u101: 'Zero DAS as Input',
  u102: 'DAS was already minted',
  u103: 'You did not paid enough',
  u104: 'Not a multiplier',

  u200: 'DAS is not running',
  u201: 'DAS is occupied',
  u202: 'You are not the current User',
  u203: 'DAS not having enough STX',
  u204: 'DAS not having enough DAS Tokens',
  u205: 'Failure in Contract, Getting Tok',
}

export const initiateConnectionSubscribeBlocks = async (
  address: string,
  appState: IAppState,
  setAppstate: Dispatch<SetStateAction<IAppState>>
) => {
  const client = await connectWebSocketClient(websocketUrl)
  client.subscribeBlocks(async (blockInfo: Block) => {
    const account = await getBalance(address)
    console.log('initiateConnectionSubscribeBlocks', appState.tx_status)

    const audio = new Audio('https://polybox.ethz.ch/index.php/s/ZwvTo52VUlup82S/download')
    audio.play()

    if (appState.tx_status === 'success') {
      setAppstate((prevState) => ({
        ...prevState,
        currentTxMessage: 'Transaction Successful',
        balance: {
          stx: account.stx,
          das: account.das,
        },
      }))
    } else {
      setAppstate((prevState) => ({
        ...prevState,
        balance: {
          stx: account.stx,
          das: account.das,
        },
      }))
    }
    console.log('Balances Updates')
  })
}
