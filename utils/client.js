import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID_1,
  dataset: 'production',
  apiVersion: '2023-05-18',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN_1,
  ignoreBrowserTokenWarning: true
})


