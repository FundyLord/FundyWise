// pybind_wrapper.cpp - Python bindings placeholder

#include <pybind11/pybind11.h>
#include "../cpp/debt_optimizer.h"
#include <pybind11/stl.h>
#include <vector>
#include <string>
#include <unordered_map>

namespace py = pybind11;

std::vector<std::unordered_map<std::string, double>>
minimize_transactions(py::list expenses_py)
{
    std::vector<Expense> expenses;

    for (auto expense_obj : expenses_py)
    {
        py::dict expense_dict = expense_obj.cast<py::dict>();

        Expense expense;

        expense.expense_id =
            expense_dict["expense_id"].cast<int>();

        expense.group_id =
            expense_dict["group_id"].cast<int>();

        expense.paid_by =
            expense_dict["paid_by"].cast<int>();

        expense.amount =
            expense_dict["amount"].cast<double>();

        py::list participants_py =
            expense_dict["participants"].cast<py::list>();

        for (auto participant_obj : participants_py)
        {
            py::dict participant_dict =
                participant_obj.cast<py::dict>();

            ParticipantShare share;

            share.user_id =
                participant_dict["user_id"].cast<int>();

            share.share_amount =
                participant_dict["share_amount"].cast<double>();

            expense.participants.push_back(share);
        }

        expenses.push_back(expense);
    }

    auto transactions =
        minimizeTransactions(expenses);

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
        "minimize_transactions",
        &minimize_transactions,
        "Compute optimized settlement transactions"
    );
}