import React from 'react'
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react'

interface ChartPlaceholderProps {
  title: string
  type?: 'line' | 'bar' | 'pie' | 'area'
  height?: number
  data?: Array<{ label: string; value: number }>
}

const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({
  title,
  type = 'line',
  height = 200,
  data = []
}) => {
  const getIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="w-8 h-8 text-gray-400" />
      case 'pie':
        return <PieChart className="w-8 h-8 text-gray-400" />
      case 'area':
        return <Activity className="w-8 h-8 text-gray-400" />
      default:
        return <TrendingUp className="w-8 h-8 text-gray-400" />
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div 
        className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          {getIcon()}
          <p className="text-sm text-gray-500 mt-2">Chart visualization</p>
          {data.length > 0 && (
            <div className="mt-4 space-y-1">
              {data.slice(0, 3).map((item, index) => (
                <div key={index} className="text-xs text-gray-600">
                  {item.label}: {item.value}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChartPlaceholder
