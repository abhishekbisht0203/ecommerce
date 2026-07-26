import { useSearchParams, Link } from 'react-router-dom'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('payment_id')

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-8">Your transaction has been processed successfully. Thank you for your purchase!</p>
        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-2">Payment ID</p>
            <p className="text-lg font-semibold text-gray-800">{paymentId}</p>
          </div>
        )}
        <Link to="/" className="inline-block bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition">
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
