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
  '0x18c2e87d183c5338a9142f97db176f3832b1d6de',
  '0xf2458bd228d8a39b64bd3b9f84890e957cac3bbc',
]);

export const MAGIC_EDEN = new Set([
  '0x5ebc127fae83ed5bdd91fc6a5f5767e259df5642',
  '0x475aa716337d79b5ea513bfe4cc01787eb2e6004',
]); // Base
export const DAGORA = new Set(['0xfc6e99d3c9a2ad7604b8a352beea81f6f5f41a45']);

export const NFT_MARKETPLACE_INTERACTION = BLUR_NFT_MARKETPLACE.union(
  OPENSEA_MARKETPLACE,
)
  .union(MAGIC_EDEN)
  .union(DAGORA);

// DeFi
export const CURVE = new Set([
  '0x99a58482bd75cbab83b27ec03ca68ff489b5788f', // router
  '0x16c6521dff6bab339122a0fe25a9116693265353',

  '0x4f37a9d177470499a2dd084621020b023fcffc1f', // base
  '0x0dcded3545d565ba3b19e683431381007245d983', // op
  '0x2191718cd32d02b8e60badffea33e4b5dd9a0a0d', // arb
]);

export const ONEINCH = new Set([
  // eth
  '0x111111125434b319222cdbf8c261674adb56f3ae',
  '0x11111112542d85b3ef69ae05771c2dccff4faa26',
  '0x1111111254fb6c44bac0bed2854e76f90643097d',
  '0xe069cb01d06ba617bcdf789bf2ff0d5e5ca20c71',

  // base
  '0x1111111254eeb25477b68fb85ed929f73a960582',

  // op
  '0x111111125421ca6dc452d289314280a0f8842a65',
]);

export const COW_SWAP = new Set([
  '0x9008d19f58aabd9ed0d60971565aa8510560ab41',
  '0x40a50cf069e992aa4536211b23f286ef88752187',
]);

export const AERODROME = new Set([
  '0x6cb442acf35158d5eda88fe602221b67b400be3e', // router
]);

// Also counted for Swap
export const UNISWAP = new Set([
  // eth router
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
  '0x76d631990d505e4e5b432eedb852a60897824d68',

  '0xc36442b4a4522e871399cd717abdd847ab11fe88', // position liquidity

  // arbitrum router
  '0x4c60051384bd2d3c01bfc845cf5f4b44bcbe9de5',
  '0xec8b0f7ffe3ae75d7ffab09429e3675bb63503e4',
  '0x5e325eda8064b456f4781070c0738d849c824258',
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b',

  // base router
  '0xec8b0f7ffe3ae75d7ffab09429e3675bb63503e4',
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
  '0x9e18efb3be848940b0c92d300504fb08c287fe85',

  // optimism router
  '0xb555edf5dcf85f42ceef1f3630a52a108e55a654',
  '0xec8b0f7ffe3ae75d7ffab09429e3675bb63503e4',
  '0xcb1355ff08ab38bbce60111f1bb2b784be25d7e8',
  '0x40d51104da22e3e77b683894e7e3e12e8fc61e65',
]);

export const PENDLE = new Set([
  '0x888888888889758f76e7103c6cbf23abbf58f946', // router v4
  '0x00000000005bbb0ef59571e58418f9a4357b68a0', // router v3
  '0x1b6d3e5da9004668e14ca39d1553e9a46fe842b3', // router
  '0x0000000001e4ef00d069e71d6ba041b0a16f7ea0',
  '0x41fad93f225b5c1c95f2445a5d7fcb85ba46713f',
]);
export const VELODROME = new Set([
  '0x4bf3e32de155359d1d75e8b474b66848221142fc', // router
  '0xa062ae8a9c5e11aaa026fc2670b0d65ccc8b2858', // router v2
  '0x9560e827af36c94d2ac33a39bce1fe78631088db', // token v2
]);
export const AAVE = new Set([
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  '0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
  '0x398ec7346dcd622edc5ae82352f02be94c62d119',

  '0x794a61358d6845594f94dc1db02a252b5b4814ad', // op
]);

export const MOONWELL = new Set([
  '0x1382cff3cee10d283dcca55a30496187759e4caf', // base unwrapper
  '0xa962f2974a846b30366251f4634384c1e42aef16', // op unwrapper
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
  '0x253553366da8546fc250f225fe3d25d0c782303b', // ethregistrarcontroller
  '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5', // ethregistrarcontroller
  '0x4ccb0bb02fcaba27e82a56646e81d8c5bc4119a5', // basenames registrarcontroller
  '0xd3e6775ed9b7dc12b205c8e608dc3767b9e5efda', // basenames registrarcontroller
]);
export const ONEID = new Set([
  '0x090baf1b96702fb73af0abbe826388117779d08f', // token
  '0x675f43fd6e0bdba8723f12168be6e604aa7e2f37', // mint
]);

export const NAME_SERVICE_INTERACTION = ENS.union(ONEID);

// Bridge
export const RELAY = new Set([
  '0xa5f565650890fba1824ee0f21ebbbf660a179934', // eth receiver
]);

export const BASE_BRIDGE = '0xea2a41c02fa86a4901826615f9796e603c6a4491'; // OG but deprecated
export const OP_BRIDGE = '0x4200000000000000000000000000000000000010';

export const BRIDGE_INTERACTION = bridges
  .union(RELAY)
  .union(new Set(BASE_BRIDGE))
  .union(new Set(OP_BRIDGE));
