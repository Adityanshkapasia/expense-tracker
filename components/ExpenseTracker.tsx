"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Expense {
  id: number;
  description: string;
  amount: number;
}

export default function ExpenseTracker() {
  const [input, setInput] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [error, setError] = useState<string | null>(null)

  const parseExpenses = (text: string): Expense[] => {
    const lines = text.split('\n')
    return lines.map((line, index) => {
      const match = line.match(/(\d+(\.\d+)?)(?!.*\d)/)
      if (match) {
        const amount = parseFloat(match[0])
        const description = line.slice(0, match.index).trim()
        return { id: Date.now() + index, description, amount }
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
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Expense Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter expenses (e.g., 'Groceries - 50.00' or 'Groceries 50.00')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex space-x-2 mt-4">
            <Button onClick={handleSubmit} className="flex-grow">
              Add Expenses
            </Button>
            <Button onClick={handleClearAll} variant="outline">
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
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Expense List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {expenses.map((expense) => (
                <li key={expense.id} className="flex justify-between">
                  <span>{expense.description}</span>
                  <span>${expense.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}