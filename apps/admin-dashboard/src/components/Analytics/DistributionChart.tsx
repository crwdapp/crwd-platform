import React from 'react'
import { PieChart } from 'lucide-react'

interface DistributionItem {
  label: string
  value: number
  color: string
  percentage: number
}

interface DistributionChartProps {
  title: string
  data: DistributionItem[]
  total?: number
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  title,
  data,
  total
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center space-x-6">
        {/* Chart placeholder */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <PieChart className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-500">{item.percentage}%</div>
              </div>
            </div>
          ))}
          {total && (
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-semibold text-gray-900">{total}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DistributionChart
