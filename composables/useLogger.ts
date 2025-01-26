export function useLogger() {
  // TODO: implement

  return {
    logError: (...log_info: any[]) => console.error(...log_info),
    logWarn: (...log_info: any[]) => console.warn(...log_info),
    logInfo: (...log_info: any[]) => console.log(...log_info),
  };
}