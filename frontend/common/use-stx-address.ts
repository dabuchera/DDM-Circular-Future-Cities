import { UserData } from '@stacks/auth'
import { useAuthContext } from '../providers/StacksAuthProvider'

export const useSTXAddress = (): string | undefined => {
  const { userData } = useAuthContext()

  const env = process.env.REACT_APP_NETWORK_ENV
  const isMainnet = env == 'mainnet'

  if (isMainnet) {
    return userData?.profile?.stxAddress?.mainnet as string
  }
  return userData?.profile?.stxAddress?.testnet as string
}

// export const bnsName = (): string | undefined => {
//   const [{ userData }, _] = useContext(AppContext);
//   return userData?.username || useSTXAddress();
// };

export const resolveSTXAddress = (userData: UserData | null) => {
  const env = process.env.REACT_APP_NETWORK_ENV
  const isMainnet = env == 'mainnet'

  if (isMainnet) {
    return userData?.profile?.stxAddress?.mainnet as string
  }
  return userData?.profile?.stxAddress?.testnet as string
}
