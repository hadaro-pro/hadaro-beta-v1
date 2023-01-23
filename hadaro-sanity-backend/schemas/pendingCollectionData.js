export default {
  name: 'pendingCollectionsData',
  title: 'Pending Collections Data',
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
      name: 'collectionDescription',
      title: 'Collection Description',
      type: 'string',
    },
    {
      name: 'collectionImage',
      title: 'Collection Image',
      type: 'image',
    } 
  ]
}