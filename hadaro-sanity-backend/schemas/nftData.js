export default {
  name: 'nftData',
  title: 'NFT Data',
  type: 'document',
  fields: [
    {
      name: 'nftAddress',
      title: 'nft Address',
      type: 'string',
    },
    {
      name: 'lenderAddress',
      title: 'Lender Address',
      type: 'string',
    },
    {
      name: 'tokenID',
      title: 'token ID',
      type: 'string',
    },
    {
      name: 'chain',
      title: 'Network chain',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
    },
    {
      name: 'paymentToken',
      title: 'Payment Token',
      type: 'string',
    },
    {
      name: 'maxDuration',
      title: 'Max duration (days)',
      type: 'number',
    },
    {
      name: 'transactionType',
      title: 'Transaction Type',
      type: 'string',
    },
    {
      name: 'metadataImage',
      title: 'Metadata Image',
      type: 'string',
    },
    {
      name: 'metadataDesc',
      title: 'Metadata Description',
      type: 'string',
    },
    {
      name: 'metadataName',
      title: 'Metadata Name',
      type: 'string',
    },
    {
      name: 'nftStandard',
      title: 'NFT Standard',
      type: 'string',
    }
  ]
}