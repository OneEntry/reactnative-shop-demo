export const logJSON = (message: any): void => {
  // @ts-ignore
  console.log(JSON.stringify(message, 1, 2));
};
