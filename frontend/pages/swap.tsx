import { ContractCallRegularOptions, openContractCall } from '@stacks/connect'
import {
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  uintCV,
} from '@stacks/transactions'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { classNames } from '../common/class-names'
import { resolveSTXAddress } from '../common/use-stx-address'
import PageHeading from '../components/PageHeading'
import { Token, tokenList, TokenSwapList } from '../components/TokenSwapList'
import { StyledIcon } from '../components/ui/styled-icon'
import { appDetails, contractOwnerAddress, microstacksPerSTX } from '../lib/constants'
import { IUserBalance, useAppContext } from '../providers/AppStateProvider'
import { getBalance } from '../providers/MainContainer'
import { useAuthContext } from '../providers/StacksAuthProvider'

export default function SwapPage() {
  const { network, address, userSession } = useAuthContext()
  const { appState, setAppstate } = useAppContext()

  const [tokenX, setTokenX] = useState<Token>(tokenList[0])
  const [tokenY, setTokenY] = useState<Token>(tokenList[1])
  const [tokenXAmount, setTokenXAmount] = useState<number | undefined>()
  const [tokenYAmount, setTokenYAmount] = useState(0)

  const [tokenXBalance, setTokenXBalance] = useState<number>(0.0)
  const [tokenYBalance, setTokenYBalance] = useState<number>(0.0)

  const currentPrice = 0.1

  const [exchangeRateSwitched, setExchangeRateSwitched] = useState<boolean>(false)
  const [insufficientBalance, setInsufficientBalance] = useState<boolean>(false)
  const [inverseDirection, setInverseDirection] = useState<boolean>(false)

  const firstInputRef = useRef<HTMLInputElement>(null)
  const secondInputRef = useRef<HTMLInputElement>(null)

  const [decimalError, setDecimalError] = useState(false)

  const [innerWidth, setInnerWidth] = useState(0)

  //'useEffect #1 - swap - only startup'
  useEffect(() => {
    //
    // console.log('useEffect #1 - swap - only startup')
    //
    setInnerWidth(window.innerWidth)

    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      const getData = async () => {
        try {
          const address = resolveSTXAddress(userData)
          fetchBalance(address)
        } catch (error) {
          console.error(error)
        }
      }
      void getData()
      setTokenBalances()
    }
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

  // Hier noch anpassen ob inverse oder nicht
  const setTokenBalances = () => {
    const tokenXBalance = appState.balance[tokenX.name.toLocaleLowerCase() as keyof IUserBalance]
    const tokenYBalance = appState.balance.das
    setTokenXBalance(tokenXBalance)
    setTokenYBalance(tokenYBalance)
  }

  //'useEffect #2 - swap - tokenXAmount changed'
  useEffect(() => {
    //
    // console.log('useEffect #2 - swap - tokenXAmount changed')
    //
    calculateTokenYAmount()
  }, [tokenXAmount])

  const calculateTokenYAmount = () => {
    //
    // console.log('calculateTokenYAmount')
    //
    if (tokenXAmount === 0 || tokenXAmount === undefined) {
      setTokenYAmount(0.0)
      if (secondInputRef.current) {
        secondInputRef.current.value = ''
      }
      return
    }

    // console.log(tokenXAmount)

    // STX on Top
    if (!inverseDirection) {
      setTokenYAmount(tokenXAmount / currentPrice)

      // Adjust Graphic since value in Input not used
      if (secondInputRef.current) {
        secondInputRef.current.value = (tokenXAmount / currentPrice).toString()
      }

      // Noch allfällig für Rundungsfehler
      numberTestNoDecimals(tokenXAmount / currentPrice)

      if (Number(tokenXAmount) >= tokenXBalance) {
        setInsufficientBalance(true)
      } else {
        setInsufficientBalance(false)
      }
    }
    // DAS on Top
    else {
      setTokenYAmount(Number((tokenXAmount * currentPrice).toFixed(1)))

      // Adjust Graphic since value in Input not used
      if (secondInputRef.current) {
        secondInputRef.current.value = (tokenXAmount * currentPrice).toFixed(1).toString()
      }

      numberTestNoDecimals(tokenXAmount)

      if (Number(tokenXAmount) > tokenXBalance) {
        setInsufficientBalance(true)
      } else {
        setInsufficientBalance(false)
      }
    }
  }

  const numberTestNoDecimals = (n: number) => {
    const result = n - Math.floor(n) !== 0
    //
    // console.log('numberTestNoDecimals : ' + result)
    //
    if (result) {
      setDecimalError(true)
    } else {
      setDecimalError(false)
    }
  }

  //'useEffect #3 - swap - appState changed'
  useEffect(() => {
    //
    // console.log('useEffect #3 - swap - appState changed')
    //
    if (userSession.isUserSignedIn()) {
      setTokenBalances()
    }
  }, [appState])

  const swapTokens = async () => {
    //
    // console.log('tokenXAmount : ', tokenXAmount)
    // console.log('tokenYAmount : ', tokenYAmount)
    //
    if (address) {
      if (!inverseDirection) {
        await stxToTokenSwap(Number(tokenXAmount), address)
      } else {
        if (address) await tokenToStxSwap(Number(tokenXAmount), address)
      }
    }
  }

  const stxToTokenSwap = async (stxAmount: number, address: string) => {
    // Adding Fees
    const microstacks = (stxAmount * microstacksPerSTX).toFixed(0)
    const microstacksCondition = (stxAmount * microstacksPerSTX * 1.005).toFixed(0)

    console.log(microstacks)

    const stxPostCondition = makeStandardSTXPostCondition(address, FungibleConditionCode.Equal, microstacksCondition)

    const tokenPostCondition = makeContractFungiblePostCondition(
      contractOwnerAddress,
      'das',
      FungibleConditionCode.Equal,
      tokenYAmount,
      createAssetInfo(contractOwnerAddress, 'das-token', 'das-token')
    )

    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'das',
      functionName: 'stx-to-token-swap',
      // Adding Feed
      functionArgs: [uintCV(microstacks)],
      postConditions: [stxPostCondition, tokenPostCondition],
      network,
      appDetails,
      onFinish: (data) => {
        if (firstInputRef.current && secondInputRef.current) {
          firstInputRef.current.value = ''
          secondInputRef.current.value = ''
        }
        console.log('Swap STX for DAS...', data)
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

  const tokenToStxSwap = async (dasAmount: number, address: string) => {
    const microstacks = tokenYAmount * microstacksPerSTX

    const stxPostCondition = makeContractSTXPostCondition(address, 'das', FungibleConditionCode.Equal, microstacks)

    const tokenPostCondition = makeStandardFungiblePostCondition(
      contractOwnerAddress,
      FungibleConditionCode.Equal,
      dasAmount,
      createAssetInfo(contractOwnerAddress, 'das-token', 'das-token')
    )

    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'das',
      functionName: 'token-to-stx-swap',
      functionArgs: [uintCV(dasAmount)],
      postConditions: [stxPostCondition, tokenPostCondition],
      network,
      appDetails,
      onFinish: (data) => {
        if (firstInputRef.current && secondInputRef.current) {
          firstInputRef.current.value = ''
          secondInputRef.current.value = ''
        }
        console.log('Swap DAS for STX...', data)
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

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value

    // console.log('First patternMismatch : ' + event.target.validity.patternMismatch)

    // console.log('Second patternMismatch : ' + event.target.validity.patternMismatch)

    // Solve wrong input by user
    if (event.target.validity.patternMismatch) {
      if (firstInputRef.current) {
        // setInput(undefined)
        setTokenXAmount(0)
        firstInputRef.current.value = ''
      }
      return null
    }

    // First Case Upper Input
    //
    if (name === 'tokenXAmount') {
      setTokenXAmount(Number(value))
    }
    // Second Case Under Input
    //
    else {
      setTokenYAmount(Number(value))
    }
  }

  const onSelectChange = (event: { target: { name: string; value: string } }) => {
    const value = event.target.value

    if (value === 'Pool') {
      window.location.href = '/pool'
    }
  }

  const switchTokens = () => {
    const tmpTokenX = tokenX
    setTokenX(tokenY)
    setTokenY(tmpTokenX)
    setTokenXAmount(undefined)
    setTokenYAmount(0.0)

    //Adjust Balances
    const tokenXBalanceTemp = tokenXBalance
    setTokenXBalance(tokenYBalance)
    setTokenYBalance(tokenXBalanceTemp)

    setInverseDirection(!inverseDirection)
  }

  const switchExchangeRate = () => {
    setExchangeRateSwitched(!exchangeRateSwitched)
  }

  const setupTokenX = async (newTokenX: Token) => {
    if (tokenY.id == newTokenX.id) {
      setTokenY(tokenX)
    }
    setTokenX(newTokenX)
  }

  const setupTokenY = async (newTokenY: Token) => {
    if (tokenX.id == newTokenY.id) {
      setTokenX(tokenY)
    }
    setTokenY(newTokenY)
  }

  let tabs = []
  if (address) {
    tabs = [
      { name: 'Swap', href: '/swap', current: true },
      // { name: 'Pool', href: '/pool', current: false },
    ]
  } else {
    tabs = [{ name: 'Swap', href: '/swap', current: true }]
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col gap-12 px-8">
      <PageHeading>Swap</PageHeading>
      <main className="relative flex flex-1 flex-col items-center justify-center py-12 pb-8">
        <div className="relative z-10 w-full max-w-lg rounded-lg bg-blue-500 shadow">
          <div className="flex flex-col p-4">
            <div className="mb-4 flex justify-between">
              <div>
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-white focus:border-blue-500 focus:ring-blue-500"
                    defaultValue={tabs.find((tab) => tab.current)?.name}
                    onChange={onSelectChange}
                  >
                    {tabs.map((tab) => (
                      <option key={tab.name}>{tab.name}</option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:block">
                  <nav className="flex space-x-4" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <a
                        key={tab.name}
                        href={tab.href}
                        className={classNames(
                          tab.current ? 'bg-gray-600 text-white' : 'text-white hover:text-gray-600',
                          'font-headings rounded-md px-3 py-2 text-lg transition duration-200 ease-out'
                        )}
                        aria-current={tab.current ? 'page' : undefined}
                      >
                        {tab.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            <form>
              <div className="rounded-md border border-blue-500 bg-gray-600 shadow-sm focus-within:border-white hover:border-white">
                <div className="flex items-center p-4 pb-2">
                  <TokenSwapList selected={tokenX} setSelected={setupTokenX} />
                  {tokenX.name === 'DAS' && innerWidth > 400 ? (
                    <label htmlFor="tokenXAmount" className="flex-none ml-2 text-xs font-bold text-white">
                      DAS Token has no Decimals
                    </label>
                  ) : null}
                  {/* Upper Input */}
                  <input
                    ref={firstInputRef}
                    type="text"
                    inputMode="decimal"
                    autoFocus={true}
                    autoComplete="off"
                    autoCorrect="off"
                    name="tokenXAmount"
                    id="tokenXAmount"
                    pattern={tokenX.name === 'STX' ? '^[0-9]*[.,]?[0-9]*$' : '^[0-9]*$'}
                    placeholder="0.0"
                    // value={tokenXAmount || undefined}
                    onChange={onInputChange}
                    className="m-0 ml-4 flex-1 truncate border-0 bg-gray-600 p-0 text-right text-xl font-semibold text-zinc-50
                        focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="flex items-center justify-end p-4 pt-0 text-sm">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-start">
                      {tokenX.name === 'STX' ? (
                        <>
                          <p className="text-white">
                            Balance:{' '}
                            {tokenXBalance.toLocaleString('en-US', {
                              minimumFractionDigits: 6,
                              maximumFractionDigits: 6,
                            })}{' '}
                            {tokenX.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-white">
                            Balance:{' '}
                            {tokenXBalance.toLocaleString('en-US', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}{' '}
                            {tokenX.name}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={switchTokens}
                className="relative left-1/2 z-10 -mt-4 -mb-4 -ml-4 flex h-8 w-8 transform items-center justify-center 
                    rounded-md border border-white bg-gray-500 text-white hover:text-blue-500"
              >
                <StyledIcon as="SwitchVerticalIcon" size={5} />
              </button>

              <div className="mt-1 rounded-md border border-blue-500 bg-gray-600 shadow-sm focus-within:border-white hover:border-white">
                <div className="flex items-center p-4 pb-2">
                  <TokenSwapList selected={tokenY} setSelected={setupTokenY} />
                  {/* {!inverseDirection ? ( */}
                  {tokenY.name === 'DAS' && innerWidth > 400 ? (
                    <label htmlFor="tokenYAmount" className="flex-none ml-2 text-xs font-bold text-white">
                      DAS Token has no Decimals
                    </label>
                  ) : null}
                  <input
                    ref={secondInputRef}
                    type="number"
                    inputMode="decimal"
                    autoComplete="off"
                    autoCorrect="off"
                    name="tokenYAmount"
                    id="tokenYAmount"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder="0.0"
                    // value={tokenYAmount || undefined}
                    onChange={onInputChange}
                    disabled={true}
                    className="m-0 ml-4 flex-1 truncate border-0 bg-gray-600 p-0 text-right text-xl font-semibold text-white
                         focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="flex items-center justify-end p-4 pt-0 text-sm">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-start">
                      {tokenY.name === 'DAS' ? (
                        <>
                          <p className="text-white">
                            Balance:{' '}
                            {tokenYBalance.toLocaleString('en-US', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}{' '}
                            {tokenY.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-white">
                            Balance:{' '}
                            {tokenYBalance.toLocaleString('en-US', {
                              minimumFractionDigits: 6,
                              maximumFractionDigits: 6,
                            })}{' '}
                            {tokenY.name}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Orginal loadingData */}

              <div className="mt-2 flex items-center justify-end">
                <p className="text-right text-sm font-semibold text-white">
                  {exchangeRateSwitched ? (
                    <>
                      1 {tokenList[0].name} ≈{' '}
                      {(1 / currentPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}{' '}
                      {tokenList[1].name}
                    </>
                  ) : (
                    <>
                      1 {tokenList[1].name} ≈{' '}
                      {currentPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}{' '}
                      {tokenList[0].name}
                    </>
                  )}
                </p>
                <button type="button" onClick={switchExchangeRate} className="ml-2 text-gray-600 hover:text-white">
                  <StyledIcon as="SwitchHorizontalIcon" size={5} />
                </button>
              </div>

              {/* state.userData */}
              {address ? (
                <button
                  type="button"
                  disabled={
                    // loadingData ||
                    insufficientBalance || tokenYAmount === 0 || decimalError
                    // !foundPair ||
                    // !pairEnabled
                  }
                  onClick={() => swapTokens()}
                  className={classNames(
                    // !pairEnabled ||
                    tokenYAmount === 0 || insufficientBalance || decimalError
                      ? // !foundPair
                        'cursor-not-allowed bg-gray-500 hover:bg-gray-500'
                      : 'cursor-pointer bg-blue-500 hover:bg-blue-500',
                    'mt-4 inline-flex w-full items-center justify-center rounded-md border-2 border-gray-500 hover:bg-gray-500 px-4 py-3 text-center text-xl font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2'
                  )}
                >
                  {insufficientBalance
                    ? 'Insufficient balance'
                    : decimalError
                    ? 'DAS cannot have decimals'
                    : tokenYAmount === 0
                    ? 'Please enter an amount'
                    : 'Swap'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={true}
                  className="mt-4 cursor-not-allowed inline-flex w-full items-center justify-center rounded-md border border-transparent 
                      bg-gray-600 px-4 py-3 text-center text-xl font-medium text-white shadow-sm"
                >
                  Please Logging In...
                </button>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
