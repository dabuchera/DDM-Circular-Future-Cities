import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppProvider from '../providers/AppStateProvider'
import StacksAuthProvider from '../providers/StacksAuthProvider'
import MainContainer from '../providers/MainContainer'
import MarkersProvider from '../providers/MarkersProvider'

function MyApp(appProps: AppProps) {
  return (
    <StacksAuthProvider>
      <AppProvider>
        <MarkersProvider>
          <MainContainer {...appProps} />
        </MarkersProvider>
      </AppProvider>
    </StacksAuthProvider>
  )
}

export default MyApp
