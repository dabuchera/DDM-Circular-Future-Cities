import { ContractCallRegularOptions, openContractCall } from '@stacks/connect'
import { callReadOnlyFunction, cvToValue } from '@stacks/transactions'
import { StacksNetwork } from '@stacks/network'
import { useEffect, useState } from 'react'
import PageHeading from '../components/PageHeading'
import { appDetails, contractOwnerAddress } from '../lib/constants'
import truncateMiddle from '../lib/truncate'
import { useAppContext } from '../providers/AppStateProvider'
import { useAuthContext } from '../providers/StacksAuthProvider'
import { StandardButton, ColorButton, LinkButton, NoLoggingButton } from '../components/Buttons'

export default function AdminPage() {
  const { network, address } = useAuthContext()
  const { appState, setAppstate } = useAppContext()
  // const { addTransactionToast } = useTransactionToasts()

  const [minted, setMinted] = useState<boolean>(false)
  const [occupied, setOccupied] = useState<boolean>(false)
  const [operational, setOperational] = useState<boolean>(false)

  async function fetchMinted(network: StacksNetwork, userAddress: string | undefined): Promise<boolean> {
    if (userAddress) {
      const mintedTemp = await callReadOnlyFunction({
        contractAddress: contractOwnerAddress,
        contractName: 'das',
        functionName: 'get-minted',
        functionArgs: [],
        network,
        senderAddress: userAddress,
      })
      return cvToValue(mintedTemp).value
    } else {
      return false
    }
  }

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
      const mintedTemp = await fetchMinted(network, address)
      const occupiedTemp = await fetchOccupied(network, address)
      const operationalTemp = await fetchOperational(network, address)

      setMinted(mintedTemp)
      setOccupied(occupiedTemp)
      setOperational(operationalTemp)
    }
    fetchSomeData()
  }, [address, network, minted, occupied, operational, appState])

  const mintDasToken = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // (contract-call? .das mint mint-das-token)
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'das',
      functionName: 'mint-das-token',
      functionArgs: [],
      network,
      appDetails,
      // onFinish: ({ txId }) => addTransactionToast(txId, `Minting ${exchangeToken} to ${truncateMiddle(contractOwnerAddress)}...`),
      // onFinish: ({ txId }) => addTransactionToast(txId, `Minting DAS Tokens...`),
      onFinish: (data) => {
        console.log('Minting DAS Tokens...', data)
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

  const toggleEmergencyShutdown = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // (contract-call? .das toggle-emergency-shutdown)
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'das',
      functionName: 'toggle-emergency-shutdown',
      functionArgs: [],
      network,
      appDetails,
      onFinish: (data) => {
        console.log('Toggle Emergency Shutdown...', data)
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

  // Remove a User which is blocking the DAS
  const toggleEmergencyOccupied = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // (contract-call? .das toggle-emergency-occupied)
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'das',
      functionName: 'toggle-emergency-occupied',
      functionArgs: [],
      network,
      appDetails,
      onFinish: (data) => {
        console.log('Toggle Emergency Occupied...', data)
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

  const openContractOwnerLink = () => {
    console.log(network)
    const url = 'https://explorer.stacks.co/address/' + contractOwnerAddress + 'chain=testnet'
    window.open(url, '_blank')
  }

  return (
    <div className="flex flex-col laptop:max-w-[60%] gap-6 m-auto">
      <PageHeading>Admin</PageHeading>

      <div className="flex flex-col gap-6">
        <div className="flex flex-row gap-6">
          {/* Basis 1/2 */}
          <div className="mb-auto basis-1/2 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 ">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              Balances
            </h5>
            <p className="font-normal text-gray-700 pb-4 laptop:text-base tablet:text-tiny mobile:text-xs">
              Here you see....
            </p>
            <div className="flex">
              {address ? (
                <StandardButton disabled={minted || address !== contractOwnerAddress} onClick={mintDasToken}>
                  Not eligible or already minted
                </StandardButton>
              ) : (
                <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
              )}

              {/* <ActionButton disabled={minted || address !== contractOwnerAddress} onClick={mintDasToken}>
                Already Minted
              </ActionButton>
              <p className="font-bold text-xs text-gray-700 pl-3 inline-flex items-center">Not eligible or already minted</p> */}
            </div>
          </div>
          {/* Basis 1/2 */}
          <div className="mb-auto basis-1/2 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              Emergency Shutdown
            </h5>
            <p className="font-normal text-gray-700 pb-4 laptop:text-base tablet:text-tiny mobile:text-xs">
              The guardian can initiate an emergency shutdown. If the DAS is operational can be seen below.
            </p>
            <div className="flex">
              {address ? (
                <>
                  <StandardButton disabled={address !== contractOwnerAddress} onClick={toggleEmergencyShutdown}>
                    {address !== contractOwnerAddress ? 'Not Eligible' : 'Toggle'}
                  </StandardButton>
                  <ColorButton className={`ml-10 ${!operational ? 'bg-red-700' : 'bg-green-700'}`}>
                    {!operational ? 'Not Operational' : 'Operational'}
                  </ColorButton>
                </>
              ) : (
                <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
              )}

              {/* <button
                type="button"
                className={`focus:outline-none text-white ${
                  operational === false ? 'bg-red-700' : 'bg-green-700'
                } font-medium rounded-lg text-sm px-5 py-2.5 ml-4`}
              >
                {operational === false ? 'Not Operational' : 'Operational'}
              </button> */}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          {/* Basis 1/2 */}
          <div className="mb-auto basis-1/2 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              Guardian
            </h5>
            <p className="font-normal text-gray-700 pb-4 laptop:text-base tablet:text-tiny mobile:text-xs">
              Things can go wrong. That is why I have a guardian who looks after me and has limited rights. So he can put me
              down and adjust the price. In the longer term, however, this will determined by the community.{' '}
            </p>
            <LinkButton onClick={openContractOwnerLink}>{truncateMiddle(contractOwnerAddress)}</LinkButton>
          </div>
          {/* Basis 1/2 */}
          <div className="mb-auto basis-1/2 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              Resolve Occupied
            </h5>
            <p className="font-normal text-gray-700 pb-4 laptop:text-base tablet:text-tiny mobile:text-xs">
              The guardian can remove a user which is blocking the DAS. If the DAS is occupied can be seen below.
            </p>
            {address ? (
              <>
                <StandardButton disabled={address !== contractOwnerAddress} onClick={toggleEmergencyOccupied}>
                  {address !== contractOwnerAddress ? 'Not Eligible' : 'Toggle'}
                </StandardButton>
                <ColorButton className={`ml-10 ${occupied ? 'bg-red-700' : 'bg-green-700'}`}>
                  {occupied ? 'Occupied' : 'Free to Use'}
                </ColorButton>
              </>
            ) : (
              <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
            )}

            {/* {address === contractOwnerAddress ? (
              <div className="flex">
                <ActionButton onClick={toggleEmergencyOccupied}>Resolve Occupied</ActionButton>
                {occupied === true ? (
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 ml-4"
                  >
                    Occupied
                  </button>
                ) : (
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-green-700  font-medium rounded-lg text-sm px-5 py-2.5 ml-4"
                  >
                    Free to Use
                  </button>
                )}
              </div>
            ) : (
              <div className="flex">
                <ActionButton disabled onClick={toggleEmergencyOccupied}>
                  Resolve Occupied
                </ActionButton>
                {occupied === true ? (
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-red-700  font-medium rounded-lg text-sm px-5 py-2.5 ml-4"
                  >
                    Occupied
                  </button>
                ) : (
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 ml-4"
                  >
                    Free to Use
                  </button>
                )}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
