export const logger = {
  debug: (text: string, ...args: any[]) => {
    if (args.length > 0) {
      console.debug(text, args);
    } else {
      console.debug(text);
    }
  }
};
