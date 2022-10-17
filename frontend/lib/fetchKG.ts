import { LngLatLike } from 'mapbox-gl'
import StreamQuery from 'sparql-http-client'
import rdf from 'rdf-ext'
import streamToPromise from 'stream-to-promise'

export interface IAssets {
  id: number
  address: string
  lngLat: LngLatLike
  constructionDate: Date
  demolitionDate: Date
  // Add here material
}

// Maybe change to async
export async function fetchTest(): Promise<IAssets[]> {
  return new Promise(async function (resolve, reject) {
    // const endpointUrl = 'http://localhost:3030/ds/'
    const endpointUrl = 'http://23.147.226.171:3030/Test/'

    const query = `
                PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                PREFIX owl: <http://www.w3.org/2002/07/owl#>
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX : <http://www.semanticweb.org/rranjith/ontologies/2022/8/OntoCFC#>
                PREFIX schema: <http://schema.org/>

                SELECT ?id ?address ?condate ?demdate ?lat ?long WHERE {
                  ?sub rdf:type :CFC_Building .
                  ?sub :hasAddress ?addr .
                  ?sub :hasBuildingID ?id .
                  ?addr schema:streetAddress ?address .
                  ?sub :hasConstructionDate ?condate .
                  ?sub :hasDemolitionDate ?demdate .
                  ?sub :hasGeoCoordinates ?loc .
                  ?loc schema:latitude ?lat .
                  ?loc schema:longitude ?long .
                  }
                `
    ////////////////// Stream Query  /////////////////////
    const client = new StreamQuery({ endpointUrl })
    // const stream = await client.query.select(query, { headers: ['Content-Type']['application/sparql-query'], operation: "postDirect" });
    const stream = await client.query.select(query, {
      headers: { 'Content-Type': 'application/sparql-query' },
      operation: 'postDirect',
    })

    const returnArray: IAssets[] = []

    stream.on('data', (row) => {
      console.log('data')
      const tempObject: IAssets = {
        id: Number(row.id.value),
        address: row.address.value,
        lngLat: [Number(row.long.value), Number(row.lat.value)],
        constructionDate: new Date(row.condate.value),
        demolitionDate: new Date(row.demdate.value),
      }
      returnArray.push(tempObject)
    })

    stream.on('finish', () => {
      console.log('finish')
      return resolve(returnArray)
    })

    stream.on('error', (err) => {
      return reject(err)
    })
  })
  // // const endpointUrl = 'http://localhost:3030/ds/'
  // // const query = `
  // //               PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  // //               PREFIX owl: <http://www.w3.org/2002/07/owl#>
  // //               PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  // //               PREFIX : <http://www.semanticweb.org/rranjith/ontologies/2022/8/OntoCFC#>
  // //               PREFIX schema: <http://schema.org/>

  // //               SELECT ?id ?address ?condate ?demdate ?lat ?long WHERE {
  // //                 ?sub rdf:type :CFC_Building .
  // //                 ?sub :hasAddress ?addr .
  // //                 ?sub :hasBuildingID 2.
  // //                 ?sub :hasBuildingID ?id .
  // //                 ?addr schema:streetAddress ?address .
  // //                 ?sub :hasConstructionDate ?condate .
  // //                 ?sub :hasDemolitionDate ?demdate .
  // //                 ?sub :hasGeoCoordinates ?loc .
  // //                 ?loc schema:latitude ?lat .
  // //                 ?loc schema:longitude ?long .
  // //                 }
  // //               `
  // // ////////////////// Stream Query  /////////////////////
  // // const client = new StreamQuery({ endpointUrl })
  // // // const stream = await client.query.select(query, { headers: ['Content-Type']['application/sparql-query'], operation: "postDirect" });
  // // const stream = await client.query.select(query, {
  // //   headers: { 'Content-Type': 'application/sparql-query' },
  // //   operation: 'postDirect',
  // // })

  // // await streamToPromise(stream)

  // // const returnArray: IAssets[] = []

  // // stream.on('data', (row) => {
  // //   console.log('data')
  // //   const tempObject: IAssets = {
  // //     id: Number(row.id.value),
  // //     address: row.address.value,
  // //     lngLat: [Number(row.long.value), Number(row.lat.value)],
  // //     constructionDate: row.condate.value,
  // //     demolitionDate: row.demdate.value,
  // //   }
  // //   returnArray.push(tempObject)
  // // })

  // // return stream.on('end', () => {
  // //   retrun returnArray
  // // })

  // // //   returnArray.push(tempObject)
  // // //   // console.log(row.height.value)
  // // // })

  // // // stream.on('error', (err) => {
  // // //   console.error(err)
  // // // })

  // // // return ():IAssets[] => { stream.on('finish', () => {
  // // //   console.log('finish')
  // // //   console.log(returnArray)
  // // //   return returnArray
  // // // })
  // // // }

  // // return new Promise((resolve, rejects) => {
  // //   // resolve(returnArray)
  // //   resolve([
  // //     { id: 1, lngLat: [8.548217, 47.376467], demolitionDate: new Date('01.01.2025') },
  // //     { id: 2, lngLat: [8.541756206305406, 47.3722854812575], demolitionDate: new Date('01.01.2026') },
  // //     { id: 3, lngLat: [8.543099, 47.366777], demolitionDate: new Date('01.01.2026') },
  // //   ])
  // // })
}
