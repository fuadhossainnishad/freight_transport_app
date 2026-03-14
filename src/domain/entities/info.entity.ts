export interface Info {
  _id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export type InfoType = "about" | "privacy" | "terms" | "carrier" | "hiring";
