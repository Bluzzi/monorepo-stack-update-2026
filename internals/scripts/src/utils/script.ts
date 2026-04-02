export type Script = {
  description: string;
  execute: () => Promise<void> | void;
};
