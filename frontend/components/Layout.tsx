import { PropsWithChildren } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

// eslint-disable-next-line @typescript-eslint/ban-types
export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col mobile:mx-[1%] tablet:mx-[2.5%] laptop:mx-[10%] min-h-screen ">
      <Navbar />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  )
}
