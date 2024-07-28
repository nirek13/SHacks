import URLSearchParams from 'axios/lib/platform/node/classes/URLSearchParams.js'
import FormData from 'axios/lib/platform/node/classes/FormData.js'

export default {
  isNode: true,
  classes: {
    URLSearchParams,
    FormData,
    Blob: typeof Blob !== 'undefined' && Blob || null
  },
  protocols: [ 'http', 'https', 'file', 'data' ]
};
