import { EventContext, StoreContext } from "@subsquid/hydra-common";



export const accountCreatedHandler = async ({
    store,
    event,
    block,
  }: EventContext & StoreContext): Promise<void> => {
console.log('account created')
  }