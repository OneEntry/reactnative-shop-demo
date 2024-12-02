function maskToRegex(mask: string) {
  const maskRules: {[key: string]: string} = {
    '\\[\\[space\\]\\]': '\\s',
    '\\$': '[\\(\\)\\-\\+]',
    '9': '\\d',
    A: '[A-Z]',
    a: '[a-z]',
    '\\*': '[\\dA-Za-z]',
  };

  let regexPattern = mask.toString();

  for (let key in maskRules) {
    const regex = new RegExp(key, 'g');
    regexPattern = regexPattern?.replace(regex, maskRules[key]);
  }
  return regexPattern;
}

export function compileRegex(mask: string) {
  const regexPattern = maskToRegex(mask);
  return new RegExp(`^${regexPattern}$`);
}
