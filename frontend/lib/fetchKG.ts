import StreamQuery from 'sparql-http-client'

export interface IAssets {
  id: number
  lngLat: number[]
  demolitionDate: Date
}

// Maybe change to async
export function fetchTest(): IAssets[] {
  // Both the same
  // const endpointUrl = "http://localhost:3030/#/dataset/ds/sparql";
  //   const endpointUrl = 'http://localhost:3030/ds/query'
  //   // const endpointUrl = "http://localhost:3030/#/dataset/ds/query";

  //   // GraphhDB Test
  //   // const endpointUrl = "http://localhost:7200/webapi";

  //   const query = `
  //                     PREFIX cc: <http://creativecommons.org/ns#>
  //                     PREFIX bot: <https://w3id.org/bot#>
  //                     PREFIX dbo: <http://dbpedia.org/ontology/>
  //                     PREFIX dce: <http://purl.org/dc/elements/1.1/>
  //                     PREFIX dc: <http://purl.org/dc/terms/>
  //                     PREFIX owl: <http://www.w3.org/2002/07/owl#>
  //                     PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  //                     PREFIX xml: <http://www.w3.org/XML/1998/namespace>
  //                     PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  //                     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  //                     PREFIX vann: <http://purl.org/vocab/vann/>
  //                     PREFIX bot_test: <http://example.org/bot_test#>

  //                     SELECT ?sub ?element
  //                     WHERE {
  //                            ?sub rdf:type bot:Space.
  //                            ?sub bot:containsElement ?element.
  //                           }
  //                     `

  //   // const queryURLencoded = encodeURI(query);
  //   const queryURLencoded =
  //     'PREFIX+cc%3A+%3Chttp%3A%2F%2Fcreativecommons.org%2Fns%23%3E+%0D%0APREFIX+bot%3A+%3Chttps%3A%2F%2Fw3id.org%2Fbot%23%3E+%0D%0APREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E+%0D%0APREFIX+dce%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E+%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E+%0D%0APREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E+%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E+%0D%0APREFIX+xml%3A+%3Chttp%3A%2F%2Fwww.w3.org%2FXML%2F1998%2Fnamespace%3E+%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E+%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+%0D%0APREFIX+vann%3A+%3Chttp%3A%2F%2Fpurl.org%2Fvocab%2Fvann%2F%3E+%0D%0APREFIX+bot_test%3A+%3Chttp%3A%2F%2Fexample.org%2Fbot_test%23%3E+%0D%0A%0D%0ASELECT+%3Fsub+%3Felement+WHERE+%7B%0D%0A++%3Fsub+rdf%3Atype+bot%3ASpace.%0D%0A++%3Fsub+bot%3AcontainsElement+%3Felement.%0D%0A%7D+LIMIT+10'
  //   ////////////////// Stream Query  /////////////////////

  //   const client = new StreamQuery({ endpointUrl })
  //   // const stream = await client.query.select(query, { headers: ['Content-Type']['application/sparql-query'], operation: "postDirect" });
  //   const stream = await client.query.select(query, {
  //     headers: { 'Content-Type': 'application/sparql-query' },
  //     operation: 'postDirect',
  //   })

  //   console.log(stream)

  //   stream.on('data', (row) => {
  //     console.log(row)
  //     // console.log(row.height.value)
  //   })

  //   stream.on('error', (err) => {
  //     console.error(err)
  //   })

  const temp: IAssets[] = [
    { id: 1, lngLat: [8.548217, 47.376467], demolitionDate: new Date('01.01.2025') },
    { id: 2, lngLat: [8.541756206305406, 47.3722854812575], demolitionDate: new Date('01.01.2026') },
  ]

  return temp
}
