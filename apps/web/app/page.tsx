import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 text-gray-900">
          SafeMind
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          Youth Guardrails for Artificially Intelligent Spaces
        </p>
        <p className="text-lg text-gray-500 mb-12">
          Protecting youth in AI conversations through intelligent monitoring
          and real-time safety analysis
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Open Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="font-semibold mb-2">Real-Time Protection</h3>
            <p className="text-sm text-gray-600">
              Monitor conversations as they happen with advanced AI detection
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🔔</div>
            <h3 className="font-semibold mb-2">Smart Alerts</h3>
            <p className="text-sm text-gray-600">
              Get notified when concerning patterns are detected
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600">
              COPPA compliant with encryption and anonymization
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
