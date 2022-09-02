import { useEffect, useState } from 'react'
import { LinkButton, NoLoggingButton } from '../components/Buttons'
import PageHeading from '../components/PageHeading'
import { contractOwnerAddress } from '../lib/constants'
import { fetchcurrentPrice, fetchDasInfo, fetchSpecificUserInfo, IDasStats, IUserUsageInfo } from '../lib/fetchInfos'
import truncateMiddle from '../lib/truncate'
import { useAuthContext } from '../providers/StacksAuthProvider'

export default function StatsPage() {
  const { network, address } = useAuthContext()

  const [dasInfo, setDasInfo] = useState<IDasStats | undefined>(undefined)
  const [userInfo, setUserInfo] = useState<IUserUsageInfo | undefined>(undefined)
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(undefined)

  useEffect(() => {
    const fetchDasInfoOnLoad = async () => {
      if (!address) {
        console.log("Can't fetch exchange info without sender address")
        return
      }
      const dasInfoTemp = await fetchDasInfo(network, address)
      const currentPriceTemp = await fetchcurrentPrice(network, address)
      const userInfoTemp = await fetchSpecificUserInfo(network, address)

      // console.log(dasInfoTemp)

      setDasInfo(dasInfoTemp)
      setUserInfo(userInfoTemp)
      setCurrentPrice(currentPriceTemp / 1000000)
    }
    fetchDasInfoOnLoad()
  }, [address, network])

  const openContractOwnerLink = () => {
    console.log(network)
    const url = 'https://explorer.stacks.co/address/' + contractOwnerAddress + 'chain=testnet'
    window.open(url, '_blank')
  }

  return (
    <div className="flex flex-col items-stretch max-w-4xl gap-6 m-auto">
      <PageHeading>Stats</PageHeading>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row tablet:gap-6">
          <div className="mb-auto basis-1/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              DAS@STX Balances
            </h5>
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              STX Balance
            </h5>
            {dasInfo === undefined ? (
              <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
            ) : (
              <p className="font-normal pb-4 laptop:text-base tablet:text-tiny mobile:text-xs text-gray-700">
                {dasInfo.stxBalance}
              </p>
            )}
            <h5 className="mb-2 mt-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              DAS Balance
            </h5>
            {dasInfo === undefined ? (
              <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
            ) : (
              <p className="font-normal laptop:text-base tablet:text-tiny mobile:text-xs text-gray-700">
                {dasInfo.tokenDasBalance}
              </p>
            )}
          </div>
          <div className="mb-auto basis-1/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              Your Usage Stats
            </h5>
            <p className="font-normal pb-2 laptop:text-base tablet:text-tiny mobile:text-xs text-gray-700">
              Sum of minutes spent : {userInfo?.minutesSum}
            </p>
            <label htmlFor="userStats" className="mr-5 mb-5">
              Address
            </label>
            {userInfo === undefined ? (
              <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
            ) : (
              <LinkButton disabled={userInfo === undefined} onClick={openContractOwnerLink}>
                {truncateMiddle(userInfo.address)}
              </LinkButton>
              // <p className="font-normal text-m text-gray-700">{dasInfo.tokenDasBalance}</p>
            )}
            {/* <button
              id="userStats"
              disabled={userInfo === undefined}
              type="button"
              className="mt-2 text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500
              focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-3 text-center mr-2 mb-2"
              onClick={openContractOwnerLink}
            >
              {userInfo === undefined ? 'Not Logged In' : truncateMiddle(userInfo.address)}
            </button> */}
          </div>
          <div className="mb-auto basis-1/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny  font-bold tracking-tight text-gray-900">
              Current User
            </h5>
            <p className="font-normal laptop:text-base tablet:text-tiny mobile:text-xs text-gray-700">
              {dasInfo === undefined ? (
                <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
              ) : (
                <LinkButton
                  disabled={dasInfo === undefined || dasInfo.currentUser === 'No User in the DAS'}
                  onClick={openContractOwnerLink}
                >
                  {truncateMiddle(dasInfo.lastUsage.user)}
                </LinkButton>
                // <p className="font-normal text-m text-gray-700">{dasInfo.tokenDasBalance}</p>
              )}
              {/* <button
                disabled={dasInfo === undefined || dasInfo.currentUser === 'No User in the DAS'}
                type="button"
                className={`mt-2 text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500
              focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-3 text-center mr-2 mb-2`}
                onClick={openContractOwnerLink}
              >
                {dasInfo === undefined
                  ? 'Not Logged In'
                  : dasInfo.currentUser === 'No User in the DAS'
                  ? 'No User in the DAS'
                  : truncateMiddle(dasInfo.lastUsage.user)}
              </button> */}
            </p>
          </div>
        </div>
        <div className="flex flex-row tablet:gap-6">
          <div className="mb-auto basis-1/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              Last Session
            </h5>
            <p className="font-normal pb-2 laptop:text-base tablet:text-tiny mobile:text-xs text-gray-700">
              Duration of the Session : {dasInfo?.lastUsage.duration}
            </p>
            <label htmlFor="lastSession" className="mr-5">
              Last User
            </label>
            {dasInfo === undefined ? (
              <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
            ) : (
              <LinkButton
                disabled={dasInfo === undefined || dasInfo.lastUsage.duration === 0}
                onClick={openContractOwnerLink}
              >
                {truncateMiddle(dasInfo.lastUsage.user)}
              </LinkButton>
              // <p className="font-normal text-m text-gray-700">{dasInfo.tokenDasBalance}</p>
            )}
            {/* <button
              id="lastSession"
              disabled={dasInfo === undefined || dasInfo.lastUsage.duration === 0}
              type="button"
              className="mt-2 text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500
              focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-3 text-center mr-2 mb-2"
              onClick={openContractOwnerLink}
            >
              {dasInfo === undefined
                ? 'Not Logged In'
                : dasInfo.lastUsage.duration !== 0
                ? truncateMiddle(dasInfo.lastUsage.user)
                : 'Not used yet'}
            </button> */}
          </div>
          <div className="mb-auto basis-1/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              #Visitors
            </h5>
            {dasInfo === undefined ? (
              <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
            ) : (
              <p className="font-normal pb-4 laptop:text-base tablet:text-tiny mobile:text-xs text-gray-700">
                {dasInfo.counterUsers}
              </p>
            )}

            <h5 className="mb-2 mt-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              #Minutes used
            </h5>
            {dasInfo === undefined ? (
              <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
            ) : (
              <p className="font-normal pb-4 laptop:text-base tablet:text-tiny mobile:text-xs text-gray-700">
                {dasInfo.counterDuration}
              </p>
            )}
          </div>
          <div className="mb-auto basis-1/3 mobile:p-2 tablet:p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
              Current Price
            </h5>
            {dasInfo === undefined ? (
              <NoLoggingButton className="bg-gray-800 text-gray-400 order-gray-200">Not Logged In</NoLoggingButton>
            ) : (
              <p className="font-normal pb-4 laptop:text-base tablet:text-tiny mobile:text-xs text-gray-700">
                {'Currently it costs you ' + currentPrice + ' STX per DAS Token.'}
              </p>
            )}
            <p className="font-normal pt-2 laptop:text-base tablet:text-tiny mobile:text-xs text-gray-700">
              {'1 Minute of accessing the DAS costs you 1 DAS Token'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
