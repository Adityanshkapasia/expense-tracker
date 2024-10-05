"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
}

export default function ExpenseTracker() {
  const [input, setInput] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [error, setError] = useState<string | null>(null)

  const parseExpenses = (text: string): Expense[] => {
    const lines = text.split('\n')
    return lines.map((line, index) => {
      const match = line.match(/^([\d,]+)\/- (.+) (\d{2}\/\d{2}\/\d{4})$/)
      if (match) {
        const [, amountStr, description, date] = match
        const amount = parseFloat(amountStr.replace(/,/g, ''))
        return { id: Date.now() + index, amount, description, date }
      }
      return null
    }).filter((expense): expense is Expense => expense !== null)
  }

  const handleSubmit = () => {
    const newExpenses = parseExpenses(input)
    if (newExpenses.length === 0) {
      setError("No valid expenses found. Please check your input format.")
      return
    }
    setExpenses(prevExpenses => [...prevExpenses, ...newExpenses])
    setInput('')
    setError(null)
  }

  const handleClearAll = () => {
    setExpenses([])
    setInput('')
    setError(null)
  }

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center">Expense Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter expenses (e.g., '25,000/- CASH 29/08/2024')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px] mb-4"
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button onClick={handleSubmit} className="w-full sm:w-auto flex-grow">
              Add Expenses
            </Button>
            <Button onClick={handleClearAll} variant="outline" className="w-full sm:w-auto">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {expenses.length > 0 && (
        <Card className="mt-4 w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Expense List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {expenses.map((expense, index) => (
                <li key={expense.id} className="flex flex-col sm:flex-row sm:items-center text-sm sm:text-base">
                  <span className="w-6 flex-shrink-0 font-medium">{index + 1}.</span>
                  <span className="flex-shrink-0 font-medium w-24">₹{expense.amount.toLocaleString('en-IN')}</span>
                  <span className="flex-grow">{expense.description}</span>
                  <span className="flex-shrink-0 text-gray-500">{expense.date}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between items-center bg-muted rounded-b-lg">
            <span className="font-bold text-sm sm:text-base">Total:</span>
            <span className="font-bold text-lg sm:text-xl">₹{total.toLocaleString('en-IN')}</span>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}