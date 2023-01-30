export default {
  name: 'freshcollectionsData',
  title: 'Fresh Collections Data',
  type: 'document',
  fields: [
    {
      name: 'collectionName',
      title: 'Collection Name',
      type: 'string',
    },
    {
      name: 'collectionSymbol',
      title: 'Collection Symbol',
      type: 'string',
    },
    {
      name: 'chain',
      title: 'chain',
      type: 'string',
    },
    {
      name: 'collectionAddress',
      title: 'Collection Address',
      type: 'string',
    },
    {
      name: 'collectionImage',
      title: 'Collection Image',
      type: 'string',
    },
    {
      name: 'collectionDesc',
      title: 'Collection Description',
      type: 'string',
    }  
    // {
    //   name: 'collectionNfts',
    //   title: 'Collection NFTS',
    //   type: 'array',
    //   of: [{ type: 'nftData' }],
    // }
  ]
}