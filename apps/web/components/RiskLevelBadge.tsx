/**
 * Risk Level Badge Component
 * Displays risk level with appropriate styling
 */

interface RiskLevelBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  score?: number;
}

export default function RiskLevelBadge({ level, score }: RiskLevelBadgeProps) {
  const colors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    critical: 'bg-red-100 text-red-800 border-red-300',
  };

  const icons = {
    low: '✓',
    medium: '⚠',
    high: '⚠',
    critical: '🚨',
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border-2
          ${colors[level]}
        `}
      >
        <span>{icons[level]}</span>
        <span>{level.toUpperCase()}</span>
      </span>
      {score !== undefined && (
        <span className="text-gray-600 text-sm font-medium">
          Score: {score.toFixed(1)}/100
        </span>
      )}
    </div>
  );
}
