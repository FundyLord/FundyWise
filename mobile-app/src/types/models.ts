export interface User {
  id: number;
  username: string;
  full_name: string;
}

export interface Group {
  id: number;
  name: string;
  created_by: number;
}

export interface GroupCreate {
  name: string;
  created_by: number;
}

export interface SettlementTransaction {
  from_user_id: number;
  to_user_id: number;
  amount: number;
}

export interface SettlementResponse {
  transactions: SettlementTransaction[];
}

export interface GroupDetails {
  id: number;
  name: string;
  created_by: number;
}

export interface Expense {
  id: number;
  group_id: number;
  paid_by: number;
  amount: number;
  description: string | null;
}

export interface ExpenseParticipantCreate {
  user_id: number;
  share_amount: number;
}

export interface ExpenseCreate {
  group_id: number;
  paid_by: number;
  amount: number;
  description: string;
  participants: ExpenseParticipantCreate[];
}