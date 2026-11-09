const DEMO_TRACKING_NUMBER = "fh3948598014";

export function isValidDemoTrackingNumber(value: string): boolean {
  return value.trim().toLowerCase() === DEMO_TRACKING_NUMBER;
}