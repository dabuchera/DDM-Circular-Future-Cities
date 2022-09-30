import { Marker, Popup } from 'mapbox-gl'
import Image from 'next/image'
import { MouseEventHandler, useEffect, useState } from 'react'
import { IconButton, StandardButton } from '../components/Buttons'
import MapboxMap from '../components/mapbox-map'
import PageHeading from '../components/PageHeading'
import InfoPanel from '../components/InfoPanel'
import { useMarkersContext } from '../providers/MarkersProvider'
import QueryPanel from '../components/QueryPanel'
import { fetchTest, IAssets } from '../lib/fetchKG'
import SubmitPanel from '../components/SubmitPanel'

interface Markers extends Marker {
  id: number
  element: HTMLElement
}

export default function Map() {
  //   const [loading, setLoading] = useState(true)
  const [map, setMap] = useState<mapboxgl.Map>()
  const [markers, setMarkers] = useState<Markers[]>()
  //   const handleMapLoading = () => setLoading(false)
  // const { markers } = useMarkersContext()

  const [assets, setAssets] = useState<IAssets[]>()
  const [selectedAsset, setSelectedAsset] = useState<IAssets>()

  const [visibilityInfoPanel, setVisibilityInfoPanel] = useState(false)
  const [visibilityQueryPanel, setVisibilityQueryPanel] = useState(true)
  const [visibilitySubmitPanel, setVisibilitySubmitPanel] = useState(true)

  useEffect(() => {
    // Optimze here -> From one marker directly to another
    if (markers && selectedAsset && visibilityInfoPanel) {
      const marker = markers[selectedAsset.id - 1]
      marker.element.querySelectorAll('path')[0].setAttribute('fill', '#FF0000')
    } else if (markers && selectedAsset && !visibilityInfoPanel) {
      const marker = markers[selectedAsset.id - 1]
      marker.element.querySelectorAll('path')[0].setAttribute('fill', '#3B82F6')
    }
  }, [visibilityInfoPanel])

  // fetch all Markers from somewhere
  // for now hardcoding
  useEffect(() => {
    console.log('useEffect Map.tsx')
    if (map) {
      fetchTest().then((assetsReturn) => {
        console.log(assetsReturn)
        setAssets(assetsReturn)
        const tempMarkers: Markers[] = []
        assetsReturn.forEach((assetsReturnItem) => {
          const marker = new Marker({ color: '#3B82F6' })
          marker.setLngLat(assetsReturnItem.lngLat)
          // create the popup
          const popup = new Popup({ offset: 40, closeButton: false })
          popup.on('open', () => {
            setVisibilityInfoPanel(!visibilityInfoPanel)
            setSelectedAsset(assetsReturnItem)
          })
          popup.setHTML(
            `<button onclick="${console.log()}" class="laptop:px-3 laptop:py-2 tablet:px-1 tablet:py-1 mobile:px-2 mobile:py-1
         text-blue-500 laptop:text-sm tablet:text-base mobile:text-xxs font-medium border border-blue-500 rounded-md">
         ${assetsReturnItem.id}<button/>`
          )
          marker.setPopup(popup)
          marker.addTo(map)

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore Function cannot be used in the Spread Operator
          const markertemp: Markers = {
            ...marker,
            id: assetsReturnItem.id,
            element: marker.getElement(),
          }
          tempMarkers.push(markertemp)
        })
        setMarkers(tempMarkers)
      })
    }

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
  }, [map])

  const onMapClick = (e) => {
    if (e.target.className === 'mapboxgl-canvas') {
      if (visibilityInfoPanel) {
        setVisibilityInfoPanel(false)
      }
    }
  }

  const home = () => {
    map?.flyTo({ center: [8.542306, 47.37331], zoom: 14, pitch: 45, bearing: -17.6 })
  }

  const test = () => {
    console.log(markers)
  }

  return (
    <div className="map-wrapper" onClick={onMapClick}>
      <MapboxMap initialOptions={{ center: [8.542306, 47.37331] }} onLoaded={setMap}>
        <div className="flex flex-col absolute top-[10%] left-[2.5%] z-10 gap-5">
          <IconButton onClick={home}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </IconButton>
          <IconButton onClick={() => setVisibilityQueryPanel(!visibilityQueryPanel)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
            </svg>
          </IconButton>
          <IconButton onClick={() => setVisibilityInfoPanel(!visibilityInfoPanel)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </IconButton>
          <IconButton onClick={() => setVisibilitySubmitPanel(!visibilitySubmitPanel)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path
                fill="currentColor"
                d="M19 13C16.83 13 14.93 14.16 13.88 15.89C13.28 15.96 12.65 16 12 16C7.58 16 4 14.21 4 12V9C4 11.21 7.58 13 12 13S20 11.21 20 9V12C20 12.36 19.9 12.71 19.72 13.05C19.5 13 19.24 13 19 13M12 11C16.42 11 20 9.21 20 7S16.42 3 12 3 4 4.79 4 7 7.58 11 12 11M13.1 17.96C12.74 18 12.37 18 12 18C7.58 18 4 16.21 4 14V17C4 19.21 7.58 21 12 21C12.46 21 12.9 21 13.33 20.94C13.12 20.33 13 19.68 13 19C13 18.64 13.04 18.3 13.1 17.96M19 15L16 18H18V22H20V18H22L19 15Z"
              />
            </svg>
          </IconButton>
        </div>
        {/* Info Panel */}
        <div className="flex flex-col absolute top-[25%] right-[1%] z-10">
          <div
            id="infoPanel"
            className={`${
              visibilityInfoPanel ? 'opacity-100 ' : 'opacity-0'
            } bg-white max-w-screen-mobile border border-blue-500 rounded shadow-lg`}
          >
            <div className="absolute top-[0%] right-[0%]">
              <IconButton onClick={() => setVisibilityInfoPanel(!visibilityInfoPanel)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                  <path
                    fill="currentColor"
                    d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
                  />
                </svg>
              </IconButton>
            </div>
            <InfoPanel selectedAsset={selectedAsset} />
          </div>
          <div>
            {assets ? (
              <ul>
                {assets.map((asset) => (
                  <li key={asset.id}>{asset.id}</li>
                ))}
              </ul>
            ) : (
              <ul>fsdfsdf</ul>
            )}
          </div>
          <div>03</div>
        </div>
        {/* Query Panel */}
        <div className="flex flex-col absolute top-[20%] left-[10%] z-10">
          <div
            id="queryPanel"
            className={`${
              visibilityQueryPanel ? 'opacity-100 ' : 'opacity-0'
            } bg-white max-w-screen-mobile border border-blue-500 rounded shadow-lg`}
          >
            <div className="absolute top-[0%] right-[0%]">
              <IconButton onClick={() => setVisibilityQueryPanel(!visibilityQueryPanel)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                  <path
                    fill="currentColor"
                    d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
                  />
                </svg>
              </IconButton>
            </div>
            <QueryPanel test={test} setAssets={setAssets} />
          </div>
        </div>
        {/* Submit Panel */}
        <div className="flex flex-col absolute top-[15%] right-[5%] z-10">
          <div
            id="submitPanel"
            className={`${
              visibilitySubmitPanel ? 'opacity-100 ' : 'opacity-0'
            } bg-white max-w-screen-mobile border border-blue-500 rounded shadow-lg`}
          >
            <div className="absolute top-[0%] right-[0%]">
              <IconButton onClick={() => setVisibilitySubmitPanel(!visibilitySubmitPanel)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                  <path
                    fill="currentColor"
                    d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
                  />
                </svg>
              </IconButton>
            </div>
            <SubmitPanel assets={assets} />
          </div>
        </div>
      </MapboxMap>
    </div>
  )
}
