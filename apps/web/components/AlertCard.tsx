/**
 * Alert Card Component
 * Displays alerts and suggested actions
 */

interface AlertCardProps {
  title: string;
  message: string;
  actions?: string[];
  type: 'info' | 'warning' | 'error' | 'success';
}

export default function AlertCard({ title, message, actions, type }: AlertCardProps) {
  const colors = {
    info: 'bg-blue-50 border-blue-300 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-900',
    error: 'bg-red-50 border-red-300 text-red-900',
    success: 'bg-green-50 border-green-300 text-green-900',
  };

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '🚨',
    success: '✅',
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${colors[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[type]}</span>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="mb-4">{message}</p>

          {actions && actions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Suggested Actions:</h4>
              <ul className="list-disc list-inside space-y-1">
                {actions.map((action, index) => (
                  <li key={index} className="text-sm">
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
