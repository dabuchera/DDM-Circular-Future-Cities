// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Marker } from 'mapbox-gl'
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'

// const marker2 = new mapboxgl.Marker({ color: 'black', rotation: 45 }).setLngLat([12.65147, 55.608166]).addTo(mapboxMap)

export type IMarkersStateContext = {
  markers: Marker[] | undefined
  setMarkers: Dispatch<SetStateAction<Marker[] | undefined>>
}

export const MarkersContext = createContext<IMarkersStateContext | undefined>(undefined)

// eslint-disable-next-line @typescript-eslint/ban-types
export default function MarkersProvider({ children }: PropsWithChildren<{}>) {
  const [markers, setMarkers] = useState<Marker[] | undefined>(undefined)

  const value: IMarkersStateContext = { markers, setMarkers }

  return <MarkersContext.Provider value={value}>{children}</MarkersContext.Provider>
}

export function useMarkersContext() {
  const context = useContext(MarkersContext)
  if (context === undefined) {
    throw new Error('No MarkersContext available')
  }
  return context
}
