import axios from "axios";
import {
  Expense,
  ExpenseCreate,
  Group,
  GroupDetails,
  SettlementResponse,
} from "../types/models";

const API_BASE_URL = "http://192.168.29.134:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getGroups(): Promise<Group[]> {
  const response = await api.get<Group[]>("/groups");
  return response.data;
}

export async function getSettlements(
  groupId: number
): Promise<SettlementResponse> {
  const response = await api.get<SettlementResponse>(
    `/groups/${groupId}/settlements`
  );

  return response.data;
}

export async function getGroup(
  groupId: number
): Promise<GroupDetails> {
  const response = await api.get<GroupDetails>(
    `/groups/${groupId}`
  );

  return response.data;
}

export async function getGroupExpenses(
  groupId: number
): Promise<Expense[]> {
  const response = await api.get<Expense[]>(
    `/groups/${groupId}/expenses`
  );

  return response.data;
}

export async function createExpense(
  expense: ExpenseCreate
): Promise<Expense> {
  const response = await api.post<Expense>(
    "/expenses",
    expense
  );

  return response.data;
}