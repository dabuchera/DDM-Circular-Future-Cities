import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppProvider from '../providers/AppStateProvider'
import StacksAuthProvider from '../providers/StacksAuthProvider'
import MainContainer from '../providers/MainContainer'

function MyApp(appProps: AppProps) {
  return (
    <StacksAuthProvider>
      <AppProvider>
        <MainContainer {...appProps} />
      </AppProvider>
    </StacksAuthProvider>
  )
}

export default MyApp
