import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action to fetch expenses
export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", async () => {
    const response = await fetch("/api/expenses"); // Adjust API endpoint
    return response.json();
});

const expensesSlice = createSlice({
    name: "expenses",
    initialState: { list: [], loading: false },
    reducers: {
        markAsPaid: (state, action) => {
            const expense = state.list.find(exp => exp.id === action.payload);
            if (expense) expense.status = "paid";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => { state.loading = true; })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchExpenses.rejected, (state) => { state.loading = false; });
    },
});

export const { markAsPaid } = expensesSlice.actions;
export const selectExpenses = (state) => state.expenses.list;
export const selectExpensesLoading = (state) => state.expenses.loading;

export default expensesSlice.reducer;
