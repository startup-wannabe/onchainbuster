import type { UseState } from '@/app/contexts/MagicContext';

export const mustBeBoolean = (v: any) => !!v;

export const delayMs = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function selectState<T>(s: UseState<T>) {
  return s[0];
}

export function setState<T>(s: UseState<T>) {
  return s[1];
}
