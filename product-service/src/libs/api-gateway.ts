import type { JsonValue } from '@customTypes/json-value';

export const serializeResponse = (response: JsonValue) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};
