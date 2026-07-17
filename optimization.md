# Graph-Based Optimization in FundyWise 🕸️

This document details the mathematical modeling, graph theory concepts, and optimization strategies that power the **FundyWise** debt-simplification engine. Use this guide to prepare for technical discussions regarding graph algorithms, network flows, and complexity analysis.

---

## 1. Mathematical Modeling of the Transaction Graph

To simplify debts, we first model the group expense ledger as a **Directed, Weighted Graph** $G = (V, E, W)$, where:
* **Vertices ($V$):** The set of participants (users) in the group.
* **Edges ($E$):** The directed debts between participants. An edge $e = (u, v)$ means user $u$ owes money to user $v$.
* **Weights ($W$):** The numeric value of the debt. The weight $w(u, v)$ represents the exact amount of money $u$ owes to $v$.

```
   [ Dense Transaction Graph (Unoptimized) ]
             
               $20
         (A) ------> (B)
          |  \       ^
          |   \ $10  |
      $30 |    \     | $15
          v     v    |
         (C) ------> (D)
               $25
```

---

## 2. The Node Balance & Conservation Flow

For any individual node (user) $u \in V$, we calculate their **net balance** $B_u$. The net balance is the difference between the total money they are owed (incoming value) and the total money they owe to others (outgoing value):

$$B_u = \sum_{(v, u) \in E} w(v, u) - \sum_{(u, v) \in E} w(u, v)$$

### Properties of the Balance Set:
1. **Net Zero Conservation:** The sum of all net balances in a closed group is always zero:
   $$\sum_{u \in V} B_u = 0$$
2. **Node Classification:**
   * If $B_u > 0$, the node is a **Net Creditor** (they should receive money).
   * If $B_u < 0$, the node is a **Net Debtor** (they must pay money).
   * If $B_u = 0$, the node is **Balanced** and is excluded from the settlement graph.

---

## 3. The Optimization Problem: Graph Sparsification

The core objective of the settlement engine is to find a **simplified transaction graph** $G' = (V, E', W')$ that satisfies two constraints:

1. **Conservation of Balance:** The net balance of every node in the optimized graph $G'$ must be identical to its balance in the original graph $G$:
   $$B'_u = B_u \quad \forall u \in V$$
2. **Minimization of Edges (Transactions):** Minimize the number of active edges in $G'$:
   $$\min |E'|$$

In graph theory, this is known as **Graph Sparsification under Flow Conservation Constraints**.

---

## 4. Algorithmic Complexity: The NP-Complete Constraint

Finding the *absolute minimum* number of transactions is equivalent to finding the maximum number of disjoint, independent subsets of nodes whose net balances sum to zero. 
* This is a direct variation of the **Subset Sum Problem** (specifically the **Partition Problem**), which is classified as **NP-complete**.
* Solving this exactly for large groups requires checking all combinations, scaling exponentially at $O(2^V)$ time complexity.

### The FundyWise Greedy Solution (The Max-Heap Heuristic)
To ensure instant execution speeds, FundyWise utilizes a greedy heuristic that scales at **$O(V \log V)$** time complexity. 

```
[ Creditors Max-Heap ]                [ Debtors Max-Heap ]
  (Top: Max Balance)                    (Top: Max Debt)
       [+$50]                                [-$40]
       [+$20]                                [-$30]
          \                                     /
           \-- Settle: Debtor pays Creditor ---/
               Amount = min(+$50, |-$40|) = $40
```

1. **Classify Nodes:** Push all creditors ($B_u > 0$) into a Max-Heap $H_c$, and all debtors ($B_u < 0$) into a Min-Heap $H_d$ (using absolute values).
2. **Extract Extremes:** Pop the largest creditor ($u_c$) and the largest debtor ($u_d$) from the tops of the heaps. This represents the two nodes furthest from balance.
3. **Greedy Settlement:**
   * Calculate the transfer amount: $S = \min(B_{u_c}, |B_{u_d}|)$.
   * Record the edge in $G'$: $u_d \rightarrow u_c$ with weight $S$.
   * Update balances: $B_{u_c} \leftarrow B_{u_c} - S$ and $B_{u_d} \leftarrow B_{u_d} + S$.
   * Re-insert any non-zero balances back into their heaps.
4. **Repeat** until both heaps are empty.

### Theoretical Bounds:
* This greedy algorithm guarantees that the final transaction count will be at most **$V - 1$**, which is highly optimal for practical group expenses.

---

## 5. Interview Q&A Guide: Pitching the Graph Optimization

### Q1: Why do you call this a "graph-based optimization" rather than just a sorting algorithm?
> **Answer:** 
> "Because the input ledger represents a directed, weighted graph where nodes are users and edges are individual transactions. The core goal is to optimize the topology of this graph—reducing the edge count $|E|$ to at most $V-1$—while preserving the net flow (balance) at each vertex. We use priority queue heaps as a data structure to traverse and simplify this transaction graph efficiently."

### Q2: Why didn't you use a standard Max-Flow Min-Cut algorithm (like Dinic's or Ford-Fulkerson)?
> **Answer:**
> "Max-Flow algorithms are designed to find the maximum bottleneck capacity through a single source-to-sink pipeline. Our problem is different: we have multiple sources (debtors) and multiple sinks (creditors) with no fixed bottleneck pipes. 
> While we could model this as a **Minimum Cost Flow (MCF)** problem on a bipartite network, solving MCF exactly takes $O(V^2 E \log V)$ or higher. The greedy heap heuristic executes in $O(V \log V)$ time, runs instantly on mobile and server environments, and guarantees a final edge count of at most $V-1$, which is practically optimal for peer-to-peer expense sharing."

### Q3: What is the computational difference between your heap approach and sorting a vector at each step?
> **Answer:**
> "If we used a simple vector and sorted it after every settlement step, sorting would take $O(V \log V)$ time per transaction. Since we execute up to $V-1$ transactions, the total complexity would degrade to $O(V^2 \log V)$. 
> By utilizing binary max-heaps (`std::priority_queue`), extracting the top elements takes $O(1)$ time, and re-inserting modified balances takes $O(\log V)$ time. This keeps our overall complexity strictly bounded to $O(V \log V)$, which scales exceptionally well as group sizes grow."

---

## 💻 Code Analysis: How the Graph is Optimized

Below is the concrete C++ implementation from `debt_optimizer.cpp` demonstrating how the graph-based concepts are translated into executable instructions:

```cpp
std::vector<Transaction>
minimizeTransactions(const std::vector<Expense>& expenses)
{
    // Step 1: Aggregate dense graph edges into net node balances
    auto balances = computeNetBalances(expenses);

    // Pair of: {balance_amount, user_id}
    using HeapEntry = std::pair<double, int>; 

    // Step 2: Separate nodes into source (debtors) and sink (creditors) pools
    std::priority_queue<HeapEntry> creditors;
    std::priority_queue<HeapEntry> debtors;

    const double EPSILON = 1e-6; // Precision boundary

    for (const auto& [user_id, balance] : balances)
    {
        if (balance > EPSILON)
        {
            creditors.push({balance, user_id});
        }
        else if (balance < -EPSILON)
        {
            debtors.push({-balance, user_id}); // Store absolute value
        }
    }

    std::vector<Transaction> transactions;

    // Step 3: Match nodes to find the optimal sparsified path
    while (!creditors.empty() && !debtors.empty())
    {
        // Get vertex with maximum positive balance (sink)
        auto [credit_amount, creditor_id] = creditors.top();
        creditors.pop();

        // Get vertex with maximum negative balance (source)
        auto [debt_amount, debtor_id] = debtors.top();
        debtors.pop();

        // Calculate flow capacity for this transaction
        double settled_amount = std::min(credit_amount, debt_amount);

        // Add optimized edge to the output graph
        transactions.push_back({
            debtor_id,
            creditor_id,
            settled_amount
        });

        // Deduct flow
        credit_amount -= settled_amount;
        debt_amount -= settled_amount;

        // If node still has flow capacity left, re-queue it
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
```

### Graph Mapping Breakdown:
1. **Edge-to-Node Reduction (`computeNetBalances`):** Before running the solver, we collapse all incoming and outgoing edges of each node. Instead of tracking *who* owes *whom*, we only track the net balance of each vertex.
2. **Bipartite Heap Structure (`creditors` & `debtors`):** The priority queues divide our active nodes into a bipartite-like model: source nodes (who have outgoing flow) and sink nodes (who receive incoming flow). 
3. **Flow Settlement (`std::min(...)`):** Matching the max creditor and max debtor represents the greedy selection of the largest sink and source. We greedily satisfy the largest sink capacity first, reducing the overall remaining node count as fast as possible.
4. **Graph Sparsification:** By adding edges directly to the `transactions` array, we build the optimized, simplified graph $G'$ which satisfies the flow constraint while using the minimal number of edges.

