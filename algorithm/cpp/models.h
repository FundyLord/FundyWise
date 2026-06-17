// models.h - placeholder for data models

#ifndef MODELS_H
#define MODELS_H

#include <vector>

struct ParticipantShare {
    int user_id;
    double share_amount;
};

struct Expense {
    int expense_id;
    int group_id;
    int paid_by;
    double amount;
    std::vector<ParticipantShare> participants;
};

struct Transaction {
    int from_user_id;
    int to_user_id;
    double amount;
};

struct BalanceEntry {
    int user_id;
    double balance;
};

#endif