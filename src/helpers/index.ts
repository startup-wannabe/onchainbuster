export const mustBeBoolean = (v: any) => !!v;

export const delayMs = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
