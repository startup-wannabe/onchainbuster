export const BASE_SEPOLIA_CHAIN_ID = 84532;

// TODO: Change to official NFT contract later
export const mintContractAddress = '0x0e3193772aef408843a68cd17F9bb70E9dab7cc5';
export const mintABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const GRADIENT_PALLETES = [
  {
    from: '#f40076',
    to: '#df98fa',
  },
  {
    from: '#f06966',
    to: '#fad6a6',
  },
  {
    from: '#ff0076',
    to: '#590fb7',
  },
  {
    from: '#9055ff',
    to: '#13e2da',
  },
  {
    from: '#0b63f6',
    to: '#003cc5',
  },
  {
    from: '#d6ff7f',
    to: '#00b3cc',
  },
  {
    from: '#e233ff',
    to: '#ff6b00',
  },
  {
    from: '#df98fa',
    to: '#9055ff',
  },
  {
    from: '#ed7b84',
    to: '#9055ff',
  },
  {
    from: '#402565',
    to: '#30be96',
  },
  {
    from: '#402662',
    to: '#3900a6',
  },
  {
    from: '#f14658',
    to: '#dc2537',
  },
  {
    from: '#f40076',
    to: '#342711',
  },
  {
    from: '#000066',
    to: '#6699ff',
  },
  {
    from: '#cb5eee',
    to: '#4be1ec',
  },
  {
    from: '#fa7cbb',
    to: '#f14658',
  },
  {
    from: '#737dfe',
    to: '#ffcac9',
  },
  {
    from: '#2f80ed',
    to: '#b2ffda',
  },
];
