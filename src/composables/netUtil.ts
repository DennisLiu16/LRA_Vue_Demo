export function isIpv4(ip: string) {
  const regExpOfIPv4 = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
  return !regExpOfIPv4.test(ip);
}

export function isPortOutOfRange(port: number | string): boolean {
  if (+port > 65535 || +port < 1) return true;
  if (!Number.isSafeInteger(+port)) return true;
  return false;
}
