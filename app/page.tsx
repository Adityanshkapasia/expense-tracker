import ExpenseTracker from '@/components/ExpenseTracker'

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-24">
      <ExpenseTracker />
    </main>
  )
}