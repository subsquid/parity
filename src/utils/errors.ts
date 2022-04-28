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

export class UnknownVersionError extends Error {
  constructor(name: string) {
    super(`There is no relevant version for ${name}`);
  }
}
