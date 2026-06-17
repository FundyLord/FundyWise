// debt_optimizer.cpp - implementation placeholder

#include "debt_optimizer.h"
#include <queue>
#include <cmath>

std::unordered_map<int, double>
computeNetBalances(const std::vector<Expense>& expenses)
{
    std::unordered_map<int, double> balances;

    for (const auto& expense : expenses)
    {
        balances[expense.paid_by] += expense.amount;

        for (const auto& participant : expense.participants)
        {
            balances[participant.user_id] -= participant.share_amount;
        }
    }

    return balances;
}

std::vector<Transaction>
minimizeTransactions(const std::vector<Expense>& expenses)
{
    auto balances = computeNetBalances(expenses);

    using HeapEntry = std::pair<double, int>;

    std::priority_queue<HeapEntry> creditors;
    std::priority_queue<HeapEntry> debtors;

    const double EPSILON = 1e-6;

    for (const auto& [user_id, balance] : balances)
    {
        if (balance > EPSILON)
        {
            creditors.push({balance, user_id});
        }
        else if (balance < -EPSILON)
        {
            debtors.push({-balance, user_id});
        }
    }

    std::vector<Transaction> transactions;

    while (!creditors.empty() && !debtors.empty())
    {
        auto [credit_amount, creditor_id] = creditors.top();
        creditors.pop();

        auto [debt_amount, debtor_id] = debtors.top();
        debtors.pop();

        double settled_amount = std::min(credit_amount, debt_amount);

        transactions.push_back({
            debtor_id,
            creditor_id,
            settled_amount
        });

        credit_amount -= settled_amount;
        debt_amount -= settled_amount;

        if (credit_amount > EPSILON)
        {
            creditors.push({credit_amount, creditor_id});
        }

        if (debt_amount > EPSILON)
        {
            debtors.push({debt_amount, debtor_id});
        }
    }

    return transactions;
}