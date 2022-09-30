import { rejects } from 'assert'
import { LngLatLike } from 'mapbox-gl'
import StreamQuery from 'sparql-http-client'

export interface IAssets {
  id: number
  lngLat: LngLatLike
  demolitionDate: Date
  sumSteel: number
}

// Maybe change to async
export async function fetchTest(): Promise<IAssets[]> {
  // Both the same
  const endpointUrl = 'http://localhost:3030/ds/'
  // const endpointUrl = 'http://localhost:3030/ds/query'
  // const endpointUrl = "http://localhost:3030/#/dataset/ds/query";

  // GraphhDB Test
  // const endpointUrl = "http://localhost:7200/webapi";

  // const query = `
  //                   PREFIX cc: <http://creativecommons.org/ns#>
  //                   PREFIX bot: <https://w3id.org/bot#>
  //                   PREFIX dbo: <http://dbpedia.org/ontology/>
  //                   PREFIX dce: <http://purl.org/dc/elements/1.1/>
  //                   PREFIX dc: <http://purl.org/dc/terms/>
  //                   PREFIX owl: <http://www.w3.org/2002/07/owl#>
  //                   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  //                   PREFIX xml: <http://www.w3.org/XML/1998/namespace>
  //                   PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  //                   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  //                   PREFIX vann: <http://purl.org/vocab/vann/>
  //                   PREFIX bot_test: <http://example.org/bot_test#>

  //                   SELECT ?sub ?element
  //                   WHERE {
  //                          ?sub rdf:type bot:Space.
  //                          ?sub bot:containsElement ?element.
  //                         }
  //                   `

  const query = `
                SELECT * WHERE {
                  ?sub ?pred ?obj .
                  ?isPublic bot:containsElement ?element.
                      }
                `

  ////////////////// Stream Query  /////////////////////
  const client = new StreamQuery({ endpointUrl })
  // const stream = await client.query.select(query, { headers: ['Content-Type']['application/sparql-query'], operation: "postDirect" });
  const stream = await client.query.select(query, {
    headers: { 'Content-Type': 'application/sparql-query' },
    operation: 'postDirect',
  })

  console.log(stream)

  stream.on('data', (row) => {
    console.log('row')
    console.log(row)
    // console.log(row.height.value)
  })

  stream.on('error', (err) => {
    console.error(err)
  })

  return new Promise((resolve, rejects) => {
    resolve([
      { id: 1, lngLat: [8.548217, 47.376467], demolitionDate: new Date('01.01.2025'), sumSteel: 150 },
      { id: 2, lngLat: [8.541756206305406, 47.3722854812575], demolitionDate: new Date('01.01.2026'), sumSteel: 0 },
      { id: 3, lngLat: [8.543099, 47.366777], demolitionDate: new Date('01.01.2026'), sumSteel: 150 },
    ])
  })
}
