"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Transaction, TransactionType } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";
import { paginate } from "@/features/erp/helpers";
import { TransactionsView } from "@/features/erp/views/transactions";

export default function TransactionsPage() {
  const { sectors, settings, refreshTrigger, openTransactionModal, openConfirmModal, showToast, triggerRefresh } = useApp();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"ALL" | TransactionType>("ALL");
  const [search, setSearch] = useState("");
  const [advanced, setAdvanced] = useState({ sectorId: "", status: "", paymentMethod: "", dateFrom: "", dateTo: "" });
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.transactions(filter);
      setTransactions(data);
    } catch { /* keep previous */ }
  }, [filter]);

  useEffect(() => { void fetchData(); }, [fetchData, refreshTrigger]);

  const filtered = transactions.filter((t) => {
    const term = search.toLowerCase();
    return (
      (!term || t.description.toLowerCase().includes(term) || t.category.toLowerCase().includes(term) || t.paymentMethod.toLowerCase().includes(term)) &&
      (!advanced.sectorId || t.sectorId === advanced.sectorId) &&
      (!advanced.status || t.status === advanced.status) &&
      (!advanced.paymentMethod || t.paymentMethod === advanced.paymentMethod) &&
      (!advanced.dateFrom || t.occurredAt.slice(0, 10) >= advanced.dateFrom) &&
      (!advanced.dateTo || t.occurredAt.slice(0, 10) <= advanced.dateTo)
    );
  });

  const paged = paginate(filtered, page);

  const deleteTransaction = (t: Transaction) => {
    openConfirmModal(`Delete "${t.description}"? This cannot be undone.`, async () => {
      await api.deleteTransaction(t.id);
      showToast("Transaction deleted");
      triggerRefresh();
    });
  };

  return (
    <div className="screen-wrapper">
      <TransactionsView
        filter={filter}
        onFilter={(f) => { setFilter(f); setPage(1); }}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        advanced={advanced}
        onAdvanced={(patch) => { setAdvanced((a) => ({ ...a, ...patch })); setPage(1); }}
        sectors={sectors}
        transactions={paged.items}
        total={filtered.length}
        page={paged.page}
        totalPages={paged.totalPages}
        onPage={setPage}
        onAddTransaction={() => openTransactionModal()}
        onEditTransaction={(t) => openTransactionModal(t)}
        onDeleteTransaction={deleteTransaction}
        language={settings?.language}
      />
    </div>
  );
}
