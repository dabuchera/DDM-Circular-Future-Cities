import { ContractCallRegularOptions, openContractCall } from '@stacks/connect'
import { callReadOnlyFunction, cvToValue, uintCV } from '@stacks/transactions'
import { StacksNetwork } from '@stacks/network'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import PageHeading from '../components/PageHeading'
import { appDetails, contractOwnerAddress } from '../lib/constants'
import truncateMiddle from '../lib/truncate'
import { useAppContext } from '../providers/AppStateProvider'
import { useAuthContext } from '../providers/StacksAuthProvider'

import { FungibleConditionCode, createAssetInfo, makeStandardFungiblePostCondition } from '@stacks/transactions'
import { StandardButton, ColorButton, LinkButton, NoLoggingButton } from '../components/Buttons'

export default function AccessPage() {
  const { network, address } = useAuthContext()
  const { appState, setAppstate } = useAppContext()
  // const { addTransactionToast } = useTransactionToasts()

  const [occupied, setOccupied] = useState<boolean>(false)
  const [operational, setOperational] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState<number | undefined>()

  async function fetchOccupied(network: StacksNetwork, userAddress: string | undefined): Promise<boolean> {
    if (userAddress) {
      const operationalTemp = await callReadOnlyFunction({
        contractAddress: contractOwnerAddress,
        contractName: 'das',
        functionName: 'get-occupied',
        functionArgs: [],
        network,
        senderAddress: userAddress,
      })
      return cvToValue(operationalTemp).value
    } else {
      return false
    }
  }

  async function fetchOperational(network: StacksNetwork, userAddress: string | undefined): Promise<boolean> {
    if (userAddress) {
      const operationalTemp = await callReadOnlyFunction({
        contractAddress: contractOwnerAddress,
        contractName: 'das',
        functionName: 'get-operational',
        functionArgs: [],
        network,
        senderAddress: userAddress,
      })
      return cvToValue(operationalTemp).value
    } else {
      return false
    }
  }

  useEffect(() => {
    const fetchSomeData = async () => {
      if (!address) {
        console.log("Can't fetch exchange info without sender address")
        return false
      }
      const occupiedTemp = await fetchOccupied(network, address)
      const operationalTemp = await fetchOperational(network, address)

      setOccupied(occupiedTemp)
      setOperational(operationalTemp)

      // console.log(operationalTemp)
    }
    fetchSomeData()
  }, [address, network, occupied, operational, appState])

  const openContractOwnerLink = () => {
    console.log(network)
    const url = 'https://explorer.stacks.co/address/' + contractOwnerAddress + '?chain=testnet'
    window.open(url, '_blank')
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    console.log('patternMismatch : ' + event.target.validity.patternMismatch)
    // https://regexr.com/
    if (event.target.validity.patternMismatch) {
      if (inputRef.current) {
        // setInput(undefined)
        inputRef.current.value = ''
      }
    } else {
      setInput(Number(event.currentTarget.value))
    }
  }

  const accessDAS = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (inputRef.current) {
      // setInput(undefined)
      inputRef.current.value = ''
    }
    setInput(undefined)

    // // With a standard principal
    const postConditionAddress = contractOwnerAddress
    const postConditionCode = FungibleConditionCode.Equal
    const postConditionAmount = Number(input)
    const assetAddressSP = contractOwnerAddress
    const assetContractNameSP = 'das-token'
    const fungibleAssetInfoSP = createAssetInfo(assetAddressSP, assetContractNameSP, assetContractNameSP)

    const standardFungiblePostCondition = makeStandardFungiblePostCondition(
      postConditionAddress,
      postConditionCode,
      postConditionAmount,
      fungibleAssetInfoSP
    )

    // With a contract principal
    // const contractAddress = contractOwnerAddress
    // const contractName = 'das'
    // const assetAddress = contractOwnerAddress
    // const assetContractName = 'das-token'
    // const fungibleAssetInfo = createAssetInfo(assetAddress, assetContractName, assetContractName)

    // const contractFungiblePostCondition = makeContractFungiblePostCondition(contractAddress, contractName, postConditionCode, postConditionAmount, fungibleAssetInfo)

    // const tokenPostCondition = makeContractFungiblePostCondition(
    //   contractOwnerAddress,
    //   'das',
    //   FungibleConditionCode.Equal,
    //   input,
    //   createAssetInfo(contractOwnerAddress, 'das-token', 'das-token')
    // )

    // (contract-call? .accessing-DAS u1)
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'das',
      functionName: 'accessing-DAS',
      functionArgs: [uintCV(Number(input))],
      network,
      appDetails,
      postConditions: [standardFungiblePostCondition],
      onFinish: (data) => {
        console.log('Access DAS...', data)
        setAppstate((prevState) => ({
          ...prevState,
          showTxModal: true,
          currentTxMessage: '',
          tx_id: data.txId,
          tx_status: 'pending',
        }))
      },
    }
    await openContractCall(options)
  }

  const exitDAS = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // (contract-call? .exiting-DAS)
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'das',
      functionName: 'exiting-DAS',
      functionArgs: [],
      network,
      appDetails,
      postConditions: [],
      onFinish: (data) => {
        console.log('Exiting DAS...', data)
        setAppstate((prevState) => ({
          ...prevState,
          showTxModal: true,
          currentTxMessage: '',
          tx_id: data.txId,
          tx_status: 'pending',
        }))
      },
    }
    await openContractCall(options)
  }

  return (
    <div className="flex flex-col laptop:max-w-[60%] gap-6 m-auto">
      <PageHeading>Access</PageHeading>
      <div className="flex flex-row gap-6">
        {/* Basis 2/3 */}
        <div className="mb-auto basis-2/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
          <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
            Buy access to the DAS
          </h5>
          <p className="font-normal text-gray-700 pb-4 laptop:text-base tablet:text-tiny mobile:text-xs">
            Here you go. You can access myself for the price you see below
          </p>
          <p className="font-bold pb-4">1 DAS per minute</p>
          <div className="flex flex-row">
            {address ? (
              <>
                <div className="w-1/3">
                  <StandardButton
                    onClick={occupied ? exitDAS : accessDAS}
                    disabled={!operational ? true : occupied ? false : !input ? true : false}
                  >
                    {!operational ? 'Not operational' : occupied ? 'Exit' : 'Accessing'}
                  </StandardButton>
                </div>
                <div className="w-1/3 font-normal laptop:text-xs tablet:text-xs mobile:text-xxs inline-flex items-center">
                  Balance: {appState.balance.das}
                </div>
                <div className="w-1/3">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    className="bg-gray-50 border max-w-[100%] border-gray-300 text-gray-900 
                    laptop:text-sm tablet:text-xs mobile:text-xxs rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={'0'}
                    pattern="^[0-9]*$"
                    onChange={onInputChange}
                    disabled={occupied || !operational}
                  />
                </div>
              </>
            ) : (
              <div className="w-full">
                <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
              </div>
            )}
          </div>
        </div>

        {/* Basis 1/3 */}
        <div className="mb-auto basis-1/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
          <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
            Status
          </h5>
          <p className="font-normal text-gray-700 pb-4 laptop:text-base tablet:text-tiny mobile:text-xs">
            What is my current status? Maybe someone is already inside
          </p>
          {address ? (
            <div className="flex">
              <ColorButton className={`${!operational ? 'bg-gray-800' : occupied ? 'bg-red-700' : 'bg-green-700'}`}>
                {!operational ? 'Not operational' : occupied ? 'Occupied' : 'Free to Use'}
              </ColorButton>
              {/* <button
                type="button"
                className={`laptop:px-4 laptop:py-4 tablet:px-2 tablet:py-2 mobile:px-2 mobile:py-2 mr-2 mb-2 
                laptop:text-sm tablet:text-xs mobile:text-xxs font-medium text-white focus:outline-none
                   bg-gray-800 rounded-lg border border-gray-200  ${
                     !operational ? 'bg-gray-800' : occupied ? 'bg-red-700' : 'bg-green-700'
                   }`}
              >
                {!operational ? 'Not operational' : occupied ? 'Occupied' : 'Free to Use'}
              </button> */}
            </div>
          ) : (
            <div className="w-full">
              <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row gap-6">
        <div className="mb-auto basis-2/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
          <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
            Guardian
          </h5>
          <p className="font-normal text-gray-700 pb-4 laptop:text-base tablet:text-tiny mobile:text-xs">
            Things can go wrong. That is why I have a guardian who looks after me and has limited acces rights. So he shut me
            down and adjust the price. In the longer term, however, this will determine the community.{' '}
          </p>
          <LinkButton onClick={openContractOwnerLink}>{truncateMiddle(contractOwnerAddress)}</LinkButton>
        </div>
        <div className="mb-auto basis-1/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
          <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
            Thank You
          </h5>
          <p className="font-normal text-gray-700 laptop:text-base tablet:text-tiny mobile:text-xs">
            Thank you for visiting me. For more information please refer the contact possibility.
          </p>
        </div>
      </div>
    </div>
  )
}
