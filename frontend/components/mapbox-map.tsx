import mapboxgl, { AnyLayer, Layer } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useState, useRef, useEffect, PropsWithChildren, ReactNode } from 'react'

interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, 'container'>
  children: ReactNode
  onCreated?(map: mapboxgl.Map): void
  onLoaded?(map: mapboxgl.Map): void
  onRemoved?(): void
}

export default function MapboxMap({ initialOptions = {}, children, onCreated, onLoaded, onRemoved }: MapboxMapProps) {
  const [map, setMap] = useState<mapboxgl.Map>()

  const mapNode = useRef(null)

  useEffect(() => {
    const node = mapNode.current

    if (typeof window === 'undefined' || node === null) return

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [8.542306, 47.37331],
      zoom: 14,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
      ...initialOptions,
    })

    // Change Cursor
    mapboxMap.getCanvas().style.cursor = 'pointer'

    mapboxMap.on('load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = mapboxMap.getStyle().layers
      const labelLayerId = layers.find((layer) => layer.type === 'symbol' && layer.layout['text-field']).id

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      mapboxMap.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
            'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      )
    })

    // mapboxMap.on('click', (e) => {
    //   console.log(e)
    // })

    setMap(mapboxMap)
    if (onCreated) onCreated(mapboxMap)

    if (onLoaded) mapboxMap.once('load', () => onLoaded(mapboxMap))

    return () => {
      mapboxMap.remove()
      setMap(undefined)
      if (onRemoved) onRemoved()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={mapNode} style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  )
}
