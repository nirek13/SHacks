'use strict';

import AxiosURLSearchParams from 'axios/lib/helpers/AxiosURLSearchParams.js';
export default typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;
