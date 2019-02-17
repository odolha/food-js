import { isDefined } from "./types.mjs";

export const tryJsonParse = str => {
  if (isDefined(str)) {
    if (typeof str === 'string') {
      try {
        return JSON.parse(str);
      } catch (e) { }
    } else {
      return str;
    }
  } else {
    return str;
  }
};

export const tryJsonStringify = json => {
  if (isDefined(json)) {
    if (typeof json === 'string') {
      return json;
    } else {
      try {
        return JSON.stringify(json);
      } catch (e) { }
    }
  } else {
    return '';
  }
};
