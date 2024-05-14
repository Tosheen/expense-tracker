import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";

import { api } from "@/lib/api";
import { Expense } from "@server/routes/expenses";

type NewExpense = Omit<Expense, "id">;

type ExpensesViewState =
  | {
      status: "loading";
    }
  | {
      status: "failed";
      error: string;
    }
  | {
      status: "idle";
    }
  | {
      status: "loaded";
      data: Expense[];
      actions: {
        createNewExpenseItem: (expense: NewExpense) => Promise<Expense>;
        deleteExpenseItem: (id: number) => Promise<Expense>;
      };
      transitions: {
        isSaving: boolean;
        isDeleting: boolean;
      };

      errors: {
        saveError: Error | null;
        deleteError: Error | null;
      };
    };

async function getAllExpenses() {
  try {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
    const response = await api.expenses.$get();
    if (response.ok === false) {
      throw new Error("server error");
    }
    const data = await response.json();
    return data.expenses;
  } catch (error) {
    throw new Error("server error");
  }
}

async function createNewExpense(data: NewExpense) {
  try {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });

    const response = await api.expenses.$post({
      json: data,
    });

    if (response.ok === false) {
      throw new Error("server error");
    }

    const expense = await response.json();

    return expense;
  } catch (error) {
    throw new Error("server error");
  }
}

async function deleteExpense(id: number) {
  try {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000);
    });

    const response = await api.expenses[":id{[0-9]+}"].$delete({
      param: {
        id: String(id),
      },
    });

    if (response.ok === false) {
      throw new Error("server error");
    }

    const expense = await response.json();

    return expense;
  } catch (error) {
    throw new Error("server error");
  }
}

export function useExpenses(): ExpensesViewState {
  const queryClient = useQueryClient();

  const expenses = useQuery({
    queryKey: ["all-expenses"],
    queryFn: getAllExpenses,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const getExpensesData = () => {
    const expensesData = queryClient.getQueryData(["all-expenses"]);

    if (expensesData == null) {
      return null;
    }

    return expensesData as Expense[];
  };

  const updateExpensesData = (data: Expense[]) => {
    queryClient.setQueryData(["all-expenses"], data);
  };

  const createNewExpenseMutation = useMutation({
    mutationFn: createNewExpense,
    onMutate: (data) => {
      const expensesData = getExpensesData();
      if (expensesData != null) {
        const newExpenses = produce(expensesData, (draft) => {
          draft.push({
            ...data,
            id: Math.round(Math.random() * 10000),
          });
        });

        updateExpensesData(newExpenses);

        return () => {
          updateExpensesData(expensesData);
        };
      }
    },
    onError: (_error, _variables, context) => {
      if (typeof context === "function") {
        context();
      }
    },
  });

  const createNewExpenseItem = async (expense: NewExpense) => {
    return createNewExpenseMutation.mutateAsync(expense);
  };

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: (_data, id) => {
      const expensesData = getExpensesData();
      if (expensesData != null) {
        const newExpenses = produce(expensesData, (draft) => {
          return draft.filter((e) => e.id != id);
        });

        updateExpensesData(newExpenses);
      }
    },
  });

  const deleteExpenseItem = (id: number) => {
    return deleteExpenseMutation.mutateAsync(id);
  };

  if (expenses.isPending) {
    return {
      status: "loading",
    };
  } else if (expenses.isError && expenses.error) {
    return {
      status: "failed",
      error: expenses.error.message,
    };
  } else if (expenses.data != null) {
    return {
      status: "loaded",
      data: expenses.data,
      actions: {
        createNewExpenseItem,
        deleteExpenseItem,
      },
      transitions: {
        isSaving: createNewExpenseMutation.isPending,
        isDeleting: deleteExpenseMutation.isPending,
      },
      errors: {
        saveError: createNewExpenseMutation.error,
        deleteError: deleteExpenseMutation.error,
      },
    };
  } else {
    return {
      status: "idle",
    };
  }
}
