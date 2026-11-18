export type DealStage =
  | "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type CustomerStatus = "prospect" | "active" | "inactive";

export interface Deal {
  id: number;
  customer_id: number;
  title: string;
  value: string; // exact decimal string from the API, never a float
  stage: DealStage;
  expected_close_date: string | null;
  description: string | null;
  lost_reason: string | null;
  customer?: Customer;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  industry: string | null;
  status: CustomerStatus;
  notes: string | null;
  deals_count?: number;
  deals?: Deal[];
}

export interface Paginated<T> {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
}