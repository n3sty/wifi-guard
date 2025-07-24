'use client'

import { motion } from 'framer-motion'
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import { Clock, Calendar, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface TimeSeriesData {
  hourly: Array<{ hour: number; count: number; timestamp: string }>
  daily: Array<{ day: string; count: number; timestamp: string }>
}

interface TimeSeriesChartProps {
  data: TimeSeriesData
  className?: string
}

function HourlyChart({ data }: { data: TimeSeriesData['hourly'] }) {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}${period}`
  }

  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="hour" 
            tickFormatter={formatHour}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            domain={[0, maxCount + 1]}
          />
          <Tooltip 
            labelFormatter={(hour) => `Time: ${formatHour(hour as number)}`}
            formatter={(value) => [value, 'Scans']}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fill="url(#hourlyGradient)"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function DailyChart({ data }: { data: TimeSeriesData['daily'] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            domain={[0, maxCount + 1]}
          />
          <Tooltip 
            formatter={(value) => [value, 'Scans']}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Bar 
            dataKey="count" 
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function PulseIndicator({ active }: { active: boolean }) {
  if (!active) return null
  
  return (
    <motion.div
      className="absolute -top-1 -right-1 w-3 h-3"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full h-full bg-green-400 rounded-full"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

export default function TimeSeriesChart({ data, className = "" }: TimeSeriesChartProps) {
  const [activeView, setActiveView] = useState<'hourly' | 'daily'>('hourly')
  
  const hourlyTotal = data.hourly.reduce((sum, item) => sum + item.count, 0)
  const dailyTotal = data.daily.reduce((sum, item) => sum + item.count, 0)
  
  // Check if there's recent activity (last 2 hours)
  const recentActivity = data.hourly.slice(-2).some(item => item.count > 0)
  
  const viewOptions = [
    {
      key: 'hourly' as const,
      label: 'Last 24 Hours',
      icon: Clock,
      total: hourlyTotal,
      active: recentActivity
    },
    {
      key: 'daily' as const,
      label: 'Last 7 Days', 
      icon: Calendar,
      total: dailyTotal,
      active: false
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Activity Timeline
          </h3>
          
          <div className="flex rounded-lg bg-gray-100 p-1">
            {viewOptions.map(({ key, label, icon: Icon, total, active }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`
                  relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${activeView === key 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {total}
                  </span>
                </div>
                <PulseIndicator active={active && activeView === key} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'hourly' ? (
            <HourlyChart data={data.hourly} />
          ) : (
            <DailyChart data={data.daily} />
          )}
        </motion.div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-blue-50 rounded-lg p-4 border border-blue-200"
          >
            <div className="text-2xl font-bold text-blue-600">
              {activeView === 'hourly' ? hourlyTotal : dailyTotal}
            </div>
            <div className="text-sm text-blue-700">
              Total scans {activeView === 'hourly' ? 'today' : 'this week'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-green-50 rounded-lg p-4 border border-green-200"
          >
            <div className="text-2xl font-bold text-green-600">
              {activeView === 'hourly' 
                ? Math.round(hourlyTotal / 24 * 10) / 10
                : Math.round(dailyTotal / 7 * 10) / 10
              }
            </div>
            <div className="text-sm text-green-700">
              Average per {activeView === 'hourly' ? 'hour' : 'day'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-purple-50 rounded-lg p-4 border border-purple-200"
          >
            <div className="text-2xl font-bold text-purple-600">
              {activeView === 'hourly'
                ? Math.max(...data.hourly.map(d => d.count))
                : Math.max(...data.daily.map(d => d.count))
              }
            </div>
            <div className="text-sm text-purple-700">
              Peak {activeView === 'hourly' ? 'hour' : 'day'}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}