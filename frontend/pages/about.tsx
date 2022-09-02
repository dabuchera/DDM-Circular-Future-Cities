import { useState } from 'react'
import MapboxMap from '../components/mapbox-map'
import PageHeading from '../components/PageHeading'

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const handleMapLoading = () => setLoading(false)

  return (
    <div className="flex flex-col laptop:max-w-[80%] gap-6 m-auto">
      <PageHeading>About</PageHeading>
      <div className="flex flex-row gap-6">
        <div className="mb-auto basis-1/2 mobile:p-2 tablet:p-6  bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 ">
          <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
            The Vision
          </h5>
          <p className="font-normal text-gray-700 laptop:text-base tablet:text-tiny mobile:text-xs">
            I am inspired by a futuristic concept called Nature 2.0, where things own themselves on the blockchain. DAS@STX
            is the adoption of the first prototype{' '}
            <a className="font-bold hover:text-blue-500" target="_blank" href="https://no1s1.space/" rel="noreferrer">
              No1s1
            </a>
            , built on Ethereum, that applies this idea to the built enviroment. I am a space that owns itself. You can read
            more details in this recently published
            <a
              className="font-bold hover:text-blue-500"
              href="https://ec-3.org/publications/conference/paper/?id=EC32021_185"
              target="_blank"
              rel="noreferrer"
            >
              {' '}
              Conference Paper
            </a>
            .
          </p>
        </div>
        <div className="mb-auto basis-1/2 mobile:p-2 tablet:p-6  bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
          <h5 className="mb-2 laptop:text-2xl tablet:text-lg mobile:text-tiny font-bold tracking-tight text-gray-900">
            The Build
          </h5>
          <p className="font-normal text-gray-700 laptop:text-base tablet:text-tiny mobile:text-xs">
            I am a room for one person and you can do whatever you want in it. Whether a nap, meditate or read a book.
            Unfortunately the hardware is not built yet. But my inspiration, the No1s1 was I am with A-frame wood modular
            construction and powered by a PV-Battery system so it can sustain myself. Anyone was welcome to enter for a small
            fee - as long as it have sufficient energy left.
          </p>
        </div>
      </div>
    </div>
  )
}
