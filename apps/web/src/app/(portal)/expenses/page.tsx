import { Button } from '@/components/ui/button'
import ExpensesTable from './expenses-table'
import Link from 'next/link'

export default async function Expenses() {
  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Expenses</h2>
          <p className='text-muted-foreground'>
            View and manage all expenses of your society
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="btn btn-primary" asChild>
            <Link href="/expenses/new">Add Expense</Link>
          </Button>
          <Button className="btn btn-secondary" asChild>
            <Link href="/expenses/import">Import</Link>
          </Button>
        </div>
      </div>
      <ExpensesTable />
    </div>
  )
}
