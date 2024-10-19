import { IMagicContext } from '@/app/contexts/MagicContext';
import BaseArmstrongData from './barmstrong.base.eth.json';
import BaseJesseData from './jesse.base.eth.json';
import BaseWbnnsData from './wbnns.base.eth.json';

export const MOCK_PROFILE_DATA = {
  BaseArmstrongData: BaseArmstrongData as any,
} as Record<string, IMagicContext>;

export const MOCK_PROFILES = [
  {
    name: 'barmstrong.base.eth',
    data: BaseArmstrongData,
  },
  {
    name: 'jesse.base.eth',
    data: BaseJesseData,
  },
  {
    name: 'wbnns.base.eth',
    data: BaseWbnnsData,
  },
];
