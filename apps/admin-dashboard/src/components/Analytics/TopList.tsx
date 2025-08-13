import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TopListItem {
  id: string
  name: string
  value: number | string
  change?: number
  subtitle?: string
}

interface TopListProps {
  title: string
  items: TopListItem[]
  valueLabel?: string
  showChange?: boolean
}

const TopList: React.FC<TopListProps> = ({
  title,
  items,
  valueLabel = 'Value',
  showChange = true
}) => {
  const getChangeIcon = (change?: number) => {
    if (!change) return <Minus className="w-4 h-4 text-gray-400" />
    return change > 0 
      ? <TrendingUp className="w-4 h-4 text-green-500" />
      : <TrendingDown className="w-4 h-4 text-red-500" />
  }

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-gray-500'
    return change > 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                {item.subtitle && (
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{item.value}</span>
              {showChange && item.change !== undefined && (
                <div className="flex items-center space-x-1">
                  {getChangeIcon(item.change)}
                  <span className={`text-sm font-medium ${getChangeColor(item.change)}`}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopList
