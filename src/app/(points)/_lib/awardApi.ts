/** Shape of a live award-search result, shared by the API route and the UI. */
export interface AwardResult {
  /** e.g. "Business" */
  cabin: string;
  /** Miles required for the date/route. */
  miles: number;
  /** Optional cash taxes/fees in INR. */
  taxesInr?: number;
  /** Marketing carrier / source for the award. */
  source?: string;
}
