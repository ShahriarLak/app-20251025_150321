'use client'

import { useState, useCallback, useMemo } from 'react'

interface TipCalculation {
  tipAmount: number
  totalAmount: number
  tipPercentage: number
}

const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState<string>('')
  const [customTip, setCustomTip] = useState<string>('')
  const [selectedTip, setSelectedTip] = useState<number | null>(null)
  const [numberOfPeople, setNumberOfPeople] = useState<string>('1')
  const [error, setError] = useState<string>('')

  const predefinedTips = [15, 18, 20]

  const validateInputs = useCallback((): boolean => {
    const bill = parseFloat(billAmount)
    const people = parseInt(numberOfPeople)

    if (!billAmount || isNaN(bill) || bill <= 0) {
      setError('Please enter a valid bill amount')
      return false
    }

    if (!numberOfPeople || isNaN(people) || people < 1) {
      setError('Number of people must be at least 1')
      return false
    }

    if (selectedTip === null && (!customTip || isNaN(parseFloat(customTip)))) {
      setError('Please select a tip percentage or enter a custom tip')
      return false
    }

    if (customTip && (isNaN(parseFloat(customTip)) || parseFloat(customTip) < 0)) {
      setError('Custom tip must be a valid positive number')
      return false
    }

    setError('')
    return true
  }, [billAmount, numberOfPeople, selectedTip, customTip])

  const calculations = useMemo((): TipCalculation | null => {
    if (!validateInputs()) return null

    const bill = parseFloat(billAmount)
    const people = parseInt(numberOfPeople)
    const tipPercentage = selectedTip !== null ? selectedTip : parseFloat(customTip)

    const tipAmount = (bill * tipPercentage) / 100
    const totalAmount = bill + tipAmount

    return {
      tipAmount: tipAmount / people,
      totalAmount: totalAmount / people,
      tipPercentage,
    }
  }, [billAmount, numberOfPeople, selectedTip, customTip, validateInputs])

  const handleBillAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBillAmount(value)
      setError('')
    }
  }

  const handleNumberOfPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setNumberOfPeople(value)
      setError('')
    }
  }

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomTip(value)
      setSelectedTip(null)
      setError('')
    }
  }

  const handleTipSelection = (tip: number) => {
    setSelectedTip(tip)
    setCustomTip('')
    setError('')
  }

  const resetCalculator = () => {
    setBillAmount('')
    setCustomTip('')
    setSelectedTip(null)
    setNumberOfPeople('1')
    setError('')
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        {/* Bill Amount Input */}
        <div>
          <label htmlFor="billAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Bill Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              id="billAmount"
              value={billAmount}
              onChange={handleBillAmountChange}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              aria-describedby="billAmount-error"
            />
          </div>
        </div>

        {/* Number of People Input */}
        <div>
          <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-2">
            Number of People
          </label>
          <input
            type="text"
            id="numberOfPeople"
            value={numberOfPeople}
            onChange={handleNumberOfPeopleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1"
            aria-describedby="numberOfPeople-error"
          />
        </div>

        {/* Tip Percentage Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Tip %
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {predefinedTips.map((tip) => (
              <button
                key={tip}
                onClick={() => handleTipSelection(tip)}
                className={`py-2 px-4 rounded-md font-medium transition-colors ${
                  selectedTip === tip
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={selectedTip === tip}
              >
                {tip}%
              </button>
            ))}
          </div>
          
          {/* Custom Tip Input */}
          <div>
            <label htmlFor="customTip" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Tip %
            </label>
            <input
              type="text"
              id="customTip"
              value={customTip}
              onChange={handleCustomTipChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter custom tip percentage"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600" role="alert">{error}</p>
          </div>
        )}

        {/* Results */}
        {calculations && !error && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Per Person ({calculations.tipPercentage}% tip):
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tip Amount:</span>
                <span className="text-lg font-semibold text-blue-600">
                  {formatCurrency(calculations.tipAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-blue-200 pt-2">
                <span className="text-gray-800 font-medium">Total per Person:</span>
                <span className="text-xl font-bold text-blue-800">
                  {formatCurrency(calculations.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={resetCalculator}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Reset Calculator
        </button>
      </div>
    </div>
  )
}

export default TipCalculator