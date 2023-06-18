import { PropertyEntry } from "../model/Model";

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected!`);
  }
}

export class JsonError extends Error {

}

export function validateAsPropertyEntry(arg: any) {
  if ((arg as PropertyEntry).address == undefined) {
    throw new MissingFieldError("address");
  }
  if ((arg as PropertyEntry).description == undefined) {
    throw new MissingFieldError("description");
  }
  if ((arg as PropertyEntry).id == undefined) {
    throw new MissingFieldError("id");
  }
}
