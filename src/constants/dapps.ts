// ------ Product Detail Contracts ---------

import { bridges, lendBorrowEarn } from './contracts';

// NFT Marketplace
export const BLUR_NFT_MARKETPLACE = new Set([
  '0xb2ecfe4e4d61f8790bbb9de2d1259b9e2410cea5',
  '0x39da41747a83aee658334415666f3ef92dd0d541',
]);

export const OPENSEA_MARKETPLACE = new Set([
  // ETH
  '0x7f268357a8c2552623316e2562d90e642bb538e5',
  '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b',
  '0x18c2E87D183C5338A9142f97dB176F3832b1D6DE',
  '0xF2458Bd228D8a39B64Bd3b9f84890e957caC3bbc',
]);

export const MAGIC_EDEN = new Set([
  '0x5ebc127fae83ed5bdd91fc6a5f5767E259dF5642',
]); // Base
export const DAGORA = new Set(['0xFc6E99D3c9A2Ad7604B8a352bEea81F6F5f41A45']);

export const NFT_MARKETPLACE_INTERACTION = BLUR_NFT_MARKETPLACE.union(
  OPENSEA_MARKETPLACE,
)
  .union(MAGIC_EDEN)
  .union(DAGORA);

// DeFi
export const CURVE = new Set([
  '0x99a58482BD75cbab83b27EC03CA68fF489b5788f', // Router
  '0x16C6521Dff6baB339122a0FE25a9116693265353',

  '0x4f37A9d177470499A2dD084621020b023fcffc1F', // Base
  '0x0DCDED3545D565bA3B19E683431381007245d983', // OP
  '0x2191718CD32d02B8E60BAdFFeA33E4B5DD9A0A0D', // ARB
]);

export const ONEINCH = new Set([
  // ETH
  '0x111111125434b319222CdBf8C261674aDB56F3ae',
  '0x11111112542D85B3EF69AE05771c2dCCff4fAa26',
  '0x1111111254fb6c44bAC0beD2854e76F90643097d',
  '0xe069CB01D06bA617bCDf789bf2ff0D5E5ca20C71',

  // Base
  '0x1111111254eeb25477b68fb85ed929f73a960582',

  // OP
  '0x111111125421cA6dc452d289314280a0f8842A65',
]);

export const COW_SWAP = new Set([
  '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
  '0x40A50cf069e992AA4536211B23F286eF88752187',
]);

export const AERODROME = new Set([
  '0x6cb442acf35158d5eda88fe602221b67b400be3e', // Router
]);

// Also counted for Swap
export const UNISWAP = new Set([
  // ETH Router
  '0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B',
  '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
  '0x76D631990d505E4e5b432EEDB852A60897824D68',

  '0xC36442b4a4522E871399CD717aBDD847Ab11FE88', // Position Liquidity

  // Arbitrum Router
  '0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5',
  '0xeC8B0F7Ffe3ae75d7FfAb09429e3675bb63503e4',
  '0x5E325eDA8064b456f4781070C0738d849c824258',
  '0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B',

  // Base Router
  '0xeC8B0F7Ffe3ae75d7FfAb09429e3675bb63503e4',
  '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
  '0x9E18Efb3BE848940b0C92D300504Fb08C287FE85',

  // Optimism Router
  '0xb555edF5dcF85f42cEeF1f3630a52A108E55A654',
  '0xeC8B0F7Ffe3ae75d7FfAb09429e3675bb63503e4',
  '0xCb1355ff08Ab38bBCE60111F1bb2B784bE25D7e8',
  '0x40d51104Da22E3e77b683894E7e3E12e8FC61E65',
]);

export const PENDLE = new Set([
  '0x888888888889758F76e7103c6CbF23ABbF58F946', // Router V4
  '0x00000000005BBB0EF59571E58418F9a4357b68A0', // Router V3
  '0x1b6d3E5Da9004668E14Ca39d1553E9a46Fe842B3', // Router
  '0x0000000001e4ef00d069e71d6ba041b0a16f7ea0',
  '0x41FAD93F225b5C1C95f2445A5d7fcB85bA46713f',
]);
export const VELODROME = new Set([
  '0x4bF3E32de155359D1D75e8B474b66848221142fc', // Router
  '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858', // Router V2
  '0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db', // Token V2
]);
export const AAVE = new Set([
  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
  '0x398eC7346DcD622eDc5ae82352F02bE94C62d119',

  '0x794a61358D6845594F94dc1DB02A252b5b4814aD', // OP
]);

export const MOONWELL = new Set([
  '0x1382cFf3CeE10D283DccA55A30496187759e4cAf', // Base Unwrapper
  '0xa962F2974A846b30366251f4634384C1e42aeF16', // OP Unwrapper
]);

export const DEFI_INTERACTION = lendBorrowEarn
  .union(CURVE)
  .union(ONEINCH)
  .union(UNISWAP)
  .union(AAVE)
  .union(PENDLE)
  .union(COW_SWAP)
  .union(VELODROME)
  .union(AERODROME);

// Name service
export const ENS = new Set([
  '0x253553366Da8546fC250F225fe3d25d0C782303b', // ETHRegistrarController
  '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5', // ETHRegistrarController
  '0x4ccb0bb02fcaba27e82a56646e81d8c5bc4119a5', // Basenames RegistrarController
  '0xd3e6775ed9b7dc12b205c8e608dc3767b9e5efda', // Basenames RegistrarController
]);
export const ONEID = new Set([
  '0x090baF1B96702FB73AF0AbBE826388117779D08f', // token
  '0x675f43FD6e0BdBA8723F12168Be6e604aA7E2F37', // mint
]);

export const NAME_SERVICE_INTERACTION = ENS.union(ONEID);

// Bridge
export const RELAY = new Set([
  '0xa5F565650890fBA1824Ee0F21EbBbF660a179934', // ETH Receiver
]);

export const BASE_BRIDGE = '0xEa2a41c02fA86A4901826615F9796e603C6a4491'; // OG but deprecated
export const OP_BRIDGE = '0x4200000000000000000000000000000000000010';

export const BRIDEG_INTERACTION = bridges
  .union(RELAY)
  .union(new Set(BASE_BRIDGE))
  .union(new Set(OP_BRIDGE));
