import { showConnect } from '@stacks/connect'
import { StandardButton } from './Buttons'
import { appDetails } from '../lib/constants'
import truncateMiddle from '../lib/truncate'
import { useAuthContext } from '../providers/StacksAuthProvider'

export default function Auth() {
  const { address, userSession, userData } = useAuthContext()

  // Hier noch alle Dependenices einbauen sodass nicht reload nötig
  const handleLogIn = async () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession,
    })
  }

  const logUserOut = async () => {
    userSession?.signUserOut()
    window.location.reload()
  }

  if (address) {
    return (
      <div className="ml-auto tablet:mr-5 flex flex-row-reverse mobile:gap-1 laptop:gap-10 laptop:w-1/3">
        <StandardButton type="button" onClick={logUserOut}>
          Log Out
        </StandardButton>
        <div className="text-white mr-2 laptop:text-sm tablet:text-xs mobile:text-xxs inline-flex items-center">
          {truncateMiddle(address)}
        </div>
      </div>
    )
  } else {
    return (
      <div className="ml-auto tablet:mr-5 flex flex-row-reverse mobile:gap-1 laptop:gap-10 laptop:w-1/3">
        <StandardButton type="button" onClick={handleLogIn}>
          Connect Wallet
        </StandardButton>
        <div className="text-white mr-2 laptop:text-sm tablet:text-xs mobile:text-xxs inline-flex items-center">
          Running @Testnet
        </div>
      </div>
    )
  }
}
