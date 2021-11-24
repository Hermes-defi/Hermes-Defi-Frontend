import { ethers } from 'ethers'
import { RPC_URLS } from '../wallet/connectors';
import { DEFAULT_CHAIN_ID } from '../config/constants';

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider( RPC_URLS[DEFAULT_CHAIN_ID] )

export default null
