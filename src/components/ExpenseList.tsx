import ExpenseItem from './ExpenseItem'

type Transaction = {
  id: number
  amount: number
  description: string
  type: 'expense' | 'income'
  date: string
}

type Props = {
  transactions: Transaction[]
  onDelete: (id: number) => void
  onUpdate: () => void
}

export default function ExpenseList({ transactions, onDelete, onUpdate }: Props) {
  if (transactions.length === 0) {
    return <p className="text-center text-gray-400 text-xl mt-10">هنوز هیچ هزینه‌ای ثبت نشده</p>
  }

  return (
    <div className="space-y-4">
      {transactions.map(t => (
        <ExpenseItem key={t.id} transaction={t} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  )
}