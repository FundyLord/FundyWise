// pybind_wrapper.cpp - Python bindings placeholder

#include <pybind11/pybind11.h>
#include "../cpp/debt_optimizer.h"
#include <pybind11/stl.h>
#include <vector>

namespace py = pybind11;

int add(int a, int b)
{
    return a + b;
}

std::unordered_map<int, double> test_balances()
{
    Expense expense;

    expense.expense_id = 1;
    expense.group_id = 1;
    expense.paid_by = 1;
    expense.amount = 1000.0;

    expense.participants = {
        {1, 500.0},
        {2, 300.0},
        {3, 200.0}
    };

    return computeNetBalances({expense});
}

std::vector<std::unordered_map<std::string, double>>
test_settlement()
{
    Expense expense;

    expense.expense_id = 1;
    expense.group_id = 1;
    expense.paid_by = 1;
    expense.amount = 1000.0;

    expense.participants = {
        {1, 500.0},
        {2, 300.0},
        {3, 200.0}
    };

    auto transactions = minimizeTransactions({expense});

    std::vector<std::unordered_map<std::string, double>> result;

    for (const auto& t : transactions)
    {
        result.push_back({
            {"from_user_id", static_cast<double>(t.from_user_id)},
            {"to_user_id", static_cast<double>(t.to_user_id)},
            {"amount", t.amount}
        });
    }

    return result;
}

PYBIND11_MODULE(debt_optimizer, m)
{
    m.doc() = "FundyWise Debt Optimization Module";

    m.def(
        "add",
        &add,
        "Add two integers"
    );

    m.def(
        "test_balances",
        &test_balances,
        "Return sample balances"
    );

    m.def(
        "test_settlement",
        &test_settlement,
        "Return sample settlement transactions"
    );
}