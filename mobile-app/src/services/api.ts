import axios from "axios";
    import {
      Expense,
      ExpenseCreate,
      Group,
      GroupDetails,
      GroupCreate,
      SettlementResponse,
      User,
    } from "../types/models";

const API_BASE_URL = "http://192.168.29.134:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getGroups(
  authUserId: string
): Promise<Group[]> {
  const response =
    await api.get<Group[]>(
      "/groups",
      {
        params: {
          auth_user_id:
            authUserId,
        },
      }
    );

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

export async function createGroup(
  group: GroupCreate
): Promise<Group> {
  const response = await api.post<Group>(
    "/groups",
    group
  );

  return response.data;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function addGroupMember(
  groupId: number,
  userId: number
): Promise<void> {
  await api.post(
    `/groups/${groupId}/members`,
    {
      user_id: userId,
    }
  );
}

export async function getGroupMembers(
  groupId: number
): Promise<User[]> {
  const response = await api.get<User[]>(
    `/groups/${groupId}/members`
  );

  return response.data;
}

export async function settleGroup(
  groupId: number
): Promise<void> {
  await api.post(
    `/groups/${groupId}/settle`
  );
}

export async function getUserByAuthId(
  authUserId: string
): Promise<User> {
  const response = await api.get<User>(
    `/users/auth/${authUserId}`
  );

  return response.data;
}

export async function deleteGroup(
  groupId: number,
  authUserId: string
): Promise<void> {
  await api.delete(
    `/groups/${groupId}`,
    {
      params: {
        auth_user_id:
          authUserId,
      },
    }
  );
}