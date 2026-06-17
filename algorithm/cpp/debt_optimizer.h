// debt_optimizer.h - header placeholder

#ifndef DEBT_OPTIMIZER_H
#define DEBT_OPTIMIZER_H

#include "models.h"
#include <unordered_map>
#include <vector>

std::unordered_map<int, double>
computeNetBalances(const std::vector<Expense>& expenses);

std::vector<Transaction>
minimizeTransactions(const std::vector<Expense>& expenses);

#endif