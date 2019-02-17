export const identity = item => item;

export const pulling = attr => item => item[attr];

export const jsonTryParse = item => {
  if (typeof item === 'string') {
    return JSON.parse(item)
  } else {
    return item;
  }
};
