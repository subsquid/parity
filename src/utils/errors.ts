import { ObjectLiteral } from "typeorm";

export class NotFoundError extends Error {
  constructor(entityName: string, metaData?: ObjectLiteral) {
    super(
      `Entity [${entityName}] was not found!; Metadata [${JSON.stringify(
        metaData
      )}]`
    );
  }
}

export class FunctionIsNotAvailableError extends Error {
  constructor(functionName: string, blockHash: string) {
    super(
      `Function [${functionName}] is not available for block [${blockHash}]!`
    );
  }
}
