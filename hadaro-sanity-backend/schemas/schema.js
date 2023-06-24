// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// import nftData from './nftData'
// import collectionsData from './collectionsData'
// import pendingCollectionData  from './pendingCollectionData'
// import freshCollectionData from './freshCollectionData'
import walletAvatar from './walletAvatar'
import testNftData from './testNftData'
import testCollectionData from './testCollectionData'
import sitePassword from './sitePassword'
import testBlockNftData from './testBlockNftData'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* Your types here! */
    // nftData,
    // collectionsData,
    // pendingCollectionData,
    // freshCollectionData,
    walletAvatar,
    sitePassword,
    // test schemas
    testBlockNftData,
    testNftData,
    testCollectionData,
  ]),
})
