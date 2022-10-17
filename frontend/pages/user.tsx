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

import { Alert, Spinner } from 'flowbite-react'
import React from 'react'

async function getStorageFiles(storage: Storage, filename?: string): Promise<boolean> {
  return await storage.listFiles((filename: string) => {
    const files: Promise<string | undefined | ArrayBuffer | null>[] = []
    const options = { decrypt: false }
    console.log('filename')
    console.log(filename)
    if (filename === 'my_data.json') {
      files.push(storage.getFile(filename, options))
      // return false to stop iterating through files
      return false
    } else {
      // return true to continue iterating
      return true
    }
  })
}

export default function UserPage() {
  const { network, address, storage } = useAuthContext()
  const { appState, setAppstate } = useAppContext()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const fetchSomeData = async () => {
      if (!address) {
        console.log("Can't fetch exchange info without sender address")
        return false
      }
      const mintedTemp = await getStorageFiles(storage, address)
    }
    fetchSomeData()
  }, [])

  // const fileContents = await Promise.all(files)
  // console.log(fileContents)
  // const test = async () => {
  //   const myData = JSON.stringify({
  //     user: 'world',
  //     tpLocation: 1,
  //   })
  //   const fileUrl = await storage.putFile('tripleStore_Location.json', myData)

  //   console.log(fileUrl)
  // }
  // test()

  // useEffect(() => {
  //   const test = async () => {
  //     const myData = JSON.stringify({
  //       user: 'world',
  //       tpLocation: 1,
  //     })
  //     const fileUrl = await storage.putFile('tripleStore_Location.json', myData)

  //     console.log(fileUrl)
  //   }
  //   test()
  // }, [])

  const test = async () => {
    /* ******************** Delete File ******************** */
    // await storage.deleteFile('my_data.json');

    /* ******************** Put Files ******************** */
    // const myData = JSON.stringify({
    //   user: 'world',
    //   tpLocation: 1,
    // })
    // // tripleStore_Location
    // const fileUrl = await storage.putFile('2.json', myData)
    // console.log(fileUrl)

    /* ******************** Get Files ******************** */
    const files: Promise<string | undefined | ArrayBuffer | null>[] = []
    const options = { decrypt: true }
    // await storage.deleteFile('my_data.json')

    await storage.listFiles((filename: string) => {
      console.log(filename)
      if (filename === 'my_data.json') {
        files.push(storage.getFile(filename, options))
        // return false to stop iterating through files
        return false
      } else {
        // return true to continue iterating
        return true
      }
    })
    const fileContents = await Promise.all(files)
    console.log(fileContents)
  }

  return (
    <>
      <div className="flex flex-col laptop:max-w-[60%] gap-6 m-auto">
        <PageHeading>User</PageHeading>

        <Alert color="info">Alert!</Alert>

        <button className="bg-white w-12 h-12" onClick={test}>
          Test
        </button>
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
                {/* {address ? (
                <StandardButton disabled={minted || address !== contractOwnerAddress} onClick={mintDasToken}>
                  Not eligible or already minted
                </StandardButton>
              ) : (
                <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
              )} */}
              </div>
            </div>
            {/* Basis 1/2 */}
            <div className="mb-auto basis-1/2 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
              <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
                Triple Store Location
              </h5>
              <p className="font-normal text-gray-700 pb-4 laptop:text-base tablet:text-tiny mobile:text-xs">
                Your data....
              </p>
              <div className="flex">
                {/* {address ? (
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
              )} */}
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
                Things can go wrong. That is why I have a guardian who looks after me and has limited rights. So he can put
                me down and adjust the price. In the longer term, however, this will determined by the community.{' '}
              </p>
              {/* <LinkButton onClick={openContractOwnerLink}>{truncateMiddle(contractOwnerAddress)}</LinkButton> */}
            </div>
            {/* Basis 1/2 */}
            <div className="mb-auto basis-1/2 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
              <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
                Resolve Occupied
              </h5>
              <p className="font-normal text-gray-700 pb-4 laptop:text-base tablet:text-tiny mobile:text-xs">
                The guardian can remove a user which is blocking the DAS. If the DAS is occupied can be seen below.
              </p>
              {/* {address ? (
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
            )} */}
            </div>
          </div>
        </div>
      </div>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        data-modal-toggle="popup-modal"
      >
        Toggle modal
      </button>
      {isLoading ? (
        <div className="text-center">
          <Spinner aria-label="Loading tooldb" size="xl" />
        </div>
      ) : (
        <React.Suspense
          fallback={
            <div className="text-center mx-auto">
              <Spinner aria-label="Loading tooldb" size="xl" />
            </div>
          }
        >
          <div
            id="popup-modal"
            tabIndex="-1"
            className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full"
          >
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-toggle="popup-modal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-6 text-center">
                  <svg
                    aria-hidden="true"
                    className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this product?
                  </h3>
                  <button
                    data-modal-toggle="popup-modal"
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    data-modal-toggle="popup-modal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </React.Suspense>
      )}
    </>
  )
}
