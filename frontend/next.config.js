/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    REACT_APP_NETWORK_ENV: 'testnet',
    REACT_APP_CONTRACT_ADDRESS: 'ST3QAYFPQJX93Z2JANY2602C2NK8ZGG0MREAMM0DH',
    REACT_APP_TOKEN_CONTRACT_NAME: 'DAS',
    CONTRACT_PRIVATE_KEY: undefined,
    LOCAL_STACKS_API_PORT: 3999,
    // API_SERVER: undefined,
    NEXT_PUBLIC_MAPBOX_TOKEN: 'pk.eyJ1IjoiZGFidWNoZXJhIiwiYSI6ImNsN2l6cmJubjAwd2MzcHA2a3p1YWk0emUifQ.8cjReXwt8Dob8JHnWT3tAw',
  },
  //https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: false,
}
