import { Marker, Popup } from 'mapbox-gl'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { IconButton, StandardButton } from '../components/Buttons'
import MapboxMap from '../components/mapbox-map'
import Markers from '../components/markers'
import PageHeading from '../components/PageHeading'
import SidebarPanel from '../components/SidebarPanel'
import { useMarkersContext } from '../providers/MarkersProvider'

export default function Map() {
  //   const [loading, setLoading] = useState(true)
  const [map, setMap] = useState<mapboxgl.Map>()
  //   const handleMapLoading = () => setLoading(false)
  const { markers } = useMarkersContext()

  const [visibilityInfoCard, setVisibilityInfoCard] = useState(true)

  // fetch all Markers from somewhere
  // for now hardcoding
  useEffect(() => {
    if (map) {
      const marker = new Marker({ color: '#3B82F6' })
      marker.setLngLat([8.543099, 47.366777])
      marker.addTo(map)

      console.log('Markers set')
    }

    // .setPopup(new Popup().setHTML('<h1>Hello World!</h1>'))

    // const marker2 = new Marker({ color: 'black', rotation: 45 }).setLngLat([12.65147, 55.608166]).addTo(map)

    // const fetchSomeData = async () => {
    //   if (!address) {
    //     console.log("Can't fetch exchange info without sender address")
    //     return false
    //   }
    //   const mintedTemp = await fetchMinted(network, address)
    //   const occupiedTemp = await fetchOccupied(network, address)
    //   const operationalTemp = await fetchOperational(network, address)

    //   setMinted(mintedTemp)
    //   setOccupied(occupiedTemp)
    //   setOperational(operationalTemp)
    // }
    // fetchSomeData()
  }, [])

  const test = () => {
    console.log('test')
    console.log(map)
    // options: mapboxgl.FlyToOptions = {

    // }
    map?.flyTo({ center: [8.542306, 47.37331], zoom: 14, pitch: 45, bearing: -17.6 })
  }

  return (
    <div className="map-wrapper">
      <MapboxMap initialOptions={{ center: [8.542306, 47.37331] }} onLoaded={setMap}>
        <div className="flex flex-col absolute top-[10%] left-[2.5%] z-10">
          <IconButton onClick={test}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </IconButton>
          <IconButton onClick={test}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </IconButton>
          <IconButton onClick={() => setVisibilityInfoCard(!visibilityInfoCard)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
            </svg>
          </IconButton>
        </div>
        <div className="flex flex-col absolute top-[25%] right-[0%] z-10">
          <div
            id="test"
            className={`${
              visibilityInfoCard ? 'opacity-100 ' : 'opacity-0'
            } bg-white max-w-screen-mobile border border-blue-500 rounded shadow-lg`}
          >
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
              <p className="text-gray-700 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis
                eaque, exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #photography
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #travel
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #winter
              </span>
            </div>
          </div>
          <div>02</div>
          <div>03</div>
        </div>
        {/* <SidebarPanel /> */}
      </MapboxMap>
    </div>
  )
}
