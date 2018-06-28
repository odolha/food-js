const doLog = (lev, text, args) => {
  if (args.length > 0) {
    console.log(`${lev}: ${text}`, args);
  } else {
    console.log(`${lev}: ${text}`);
  }
};

export const logger = {
  debug: (text: string, ...args: any[]) => {
    doLog('DEBUG', text, args)
  }
};
