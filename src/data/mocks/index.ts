import { IMagicContext } from '@/app/contexts/MagicContext';
import BaseArmstrongData from './barmstrong.base.eth.json';

export const MOCK_PROFILE_DATA = {
  BaseArmstrongData: BaseArmstrongData as any,
} as Record<string, IMagicContext>;
