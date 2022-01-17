type NewAccountCache = {
  [blockNumber: number]: {
    [address: string]: {
      extrinsicId: string | undefined;
      amount: bigint;
    };
  };
};

export const cacheNewAccountEvents: NewAccountCache = {};
