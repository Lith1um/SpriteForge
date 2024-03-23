export const throttle = (func: (...args: any[]) => void, delay: number = 25) => {
  let timerFlag: NodeJS.Timeout | undefined;

  return (...args: any[]) => {
    if (!timerFlag) {
      func(...args);
      timerFlag = setTimeout(() => timerFlag = undefined, delay);
    }
  };
}
