// tests.cpp - unit tests placeholder

#include "debt_optimizer.h"
#include <iostream>
#include <vector>

int main()
{
    Expense hotel;

    hotel.expense_id = 1;
    hotel.group_id = 1;
    hotel.paid_by = 1;      // Alice
    hotel.amount = 1000.0;

    hotel.participants = {
        {1, 500.0},
        {2, 300.0},
        {3, 200.0}
    };

    std::vector<Expense> expenses = {hotel};

    auto transactions = minimizeTransactions(expenses);

    std::cout << "Settlement Transactions\n";
    std::cout << "=======================\n";

    for (const auto& t : transactions)
    {
        std::cout
            << "User "
            << t.from_user_id
            << " pays User "
            << t.to_user_id
            << " : ₹"
            << t.amount
            << '\n';
    }

    return 0;
}