import TipCalculator from '@/components/TipCalculator'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Tip Calculator
        </h1>
        <TipCalculator />
      </div>
    </div>
  )
}