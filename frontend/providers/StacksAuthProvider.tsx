import { AppConfig, UserData, UserSession } from '@stacks/connect'
import { StacksNetwork, StacksTestnet, StacksMocknet } from '@stacks/network'
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react'

interface IStacksAuthContextValue {
  network: StacksNetwork
  address?: string
  userSession: UserSession
  userData: UserData | undefined
  setUserData: Dispatch<SetStateAction<UserData | undefined>>
}

const AuthContext = createContext<IStacksAuthContextValue | undefined>(undefined)

// eslint-disable-next-line @typescript-eslint/ban-types
export default function StacksProvider({ children }: PropsWithChildren<{}>) {
  const [userData, setUserData] = useState<UserData | undefined>(undefined)

  const network = new StacksTestnet()
  // const network = new StacksMocknet()

  const appConfig = new AppConfig(['store_write']) // Might need publish_data instead?
  const userSession = new UserSession({ appConfig })
  const address: string | undefined = userData?.profile?.stxAddress?.testnet

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData)
      })
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value: IStacksAuthContextValue = { network, address, userSession, userData, setUserData }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider')
  }
  return context
}
