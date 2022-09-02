import { PropsWithChildren } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
export default function PageHeading({ children }: PropsWithChildren<{}>) {
  return (
    <h1 className="self-center font-extrabold laptop:text-6xl tablet:text-6xl mobile:text-4xl text-blue-500">{children}</h1>
  )
}
