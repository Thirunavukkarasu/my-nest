import NewExpenseForm from '../ExpenseForm'

export default function NewExpensePage() {
    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-5">Add New Expense</h1>
            <NewExpenseForm isEditMode={false} />
        </div>
    )
}

