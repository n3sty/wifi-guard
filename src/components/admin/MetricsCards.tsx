'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Activity, 
  Shield, 
  Globe, 
  Smartphone, 
  Monitor,
  Tablet,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react'

interface MetricsData {
  summary: {
    totalUsers: number
    totalSessions: number
    totalEvents: number
    totalScans: number
    recentEvents: number
    eventTypes: Record<string, number>
    deviceStats: Record<string, number>
  }
  timeSeriesData: {
    hourly: Array<{ hour: number; count: number; timestamp: string }>
    daily: Array<{ day: string; count: number; timestamp: string }>
  }
}

interface MetricsCardsProps {
  data: MetricsData
  className?: string
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = "blue",
  delay = 0
}: {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
  color?: "blue" | "green" | "purple" | "orange" | "red"
  delay?: number
}) {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-100",
    green: "bg-green-500 text-green-100", 
    purple: "bg-purple-500 text-purple-100",
    orange: "bg-orange-500 text-orange-100",
    red: "bg-red-500 text-red-100"
  }

  const bgColorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200", 
    orange: "bg-orange-50 border-orange-200",
    red: "bg-red-50 border-red-200"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`${bgColorClasses[color]} border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {change}
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-full`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

function DeviceBreakdown({ deviceStats }: { deviceStats: Record<string, number> }) {
  const total = Object.values(deviceStats).reduce((sum, count) => sum + count, 0)
  
  if (total === 0) return null

  const devices = [
    { name: 'Mobile', icon: Smartphone, color: 'bg-blue-500' },
    { name: 'Desktop', icon: Monitor, color: 'bg-green-500' },
    { name: 'Tablet', icon: Tablet, color: 'bg-purple-500' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Smartphone className="w-5 h-5" />
        Device Breakdown
      </h3>
      
      <div className="space-y-4">
        {devices.map(({ name, icon: Icon, color }) => {
          const count = deviceStats[name] || 0
          const percentage = total > 0 ? (count / total) * 100 : 0
          
          return (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`${color} p-2 rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className={`${color} h-2 rounded-full`}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-12 text-right">
                  {count}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function EventTypesBreakdown({ eventTypes }: { eventTypes: Record<string, number> }) {
  const total = Object.values(eventTypes).reduce((sum, count) => sum + count, 0)
  
  if (total === 0) return null

  const eventTypeConfig = {
    'scan_started': { name: 'Scans Started', color: 'bg-blue-500', icon: Activity },
    'scan_completed': { name: 'Scans Completed', color: 'bg-green-500', icon: Shield },
    'page_view': { name: 'Page Views', color: 'bg-purple-500', icon: Globe },
    'session_start': { name: 'Sessions', color: 'bg-orange-500', icon: Clock },
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Event Activity
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(eventTypes).map(([eventType, count]) => {
          const config = eventTypeConfig[eventType as keyof typeof eventTypeConfig] || { 
            name: eventType, 
            color: 'bg-gray-500', 
            icon: Zap 
          }
          const percentage = total > 0 ? (count / total) * 100 : 0
          
          return (
            <motion.div
              key={eventType}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1 + Object.keys(eventTypes).indexOf(eventType) * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`${config.color} p-1.5 rounded`}>
                  <config.icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600">{config.name}</span>
              </div>
              
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of activity</div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function MetricsCards({ data, className = "" }: MetricsCardsProps) {
  const { summary, timeSeriesData } = data
  
  // Calculate growth rates
  const todayScans = timeSeriesData.daily[timeSeriesData.daily.length - 1]?.count || 0
  const yesterdayScans = timeSeriesData.daily[timeSeriesData.daily.length - 2]?.count || 0
  const dailyGrowth = yesterdayScans > 0 
    ? `${(((todayScans - yesterdayScans) / yesterdayScans) * 100).toFixed(1)}% vs yesterday`
    : "No comparison data"

  const currentHour = timeSeriesData.hourly[timeSeriesData.hourly.length - 1]?.count || 0
  const previousHour = timeSeriesData.hourly[timeSeriesData.hourly.length - 2]?.count || 0
  const hourlyActivity = currentHour > previousHour ? "↗ Active" : currentHour < previousHour ? "↘ Declining" : "→ Stable"

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={summary.totalUsers.toLocaleString()}
          icon={Users}
          color="blue"
          delay={0}
        />
        
        <MetricCard
          title="Security Scans"
          value={summary.totalScans.toLocaleString()}
          change={dailyGrowth}
          icon={Shield}
          color="green"
          delay={0.1}
        />
        
        <MetricCard
          title="Active Sessions"
          value={summary.totalSessions.toLocaleString()}
          icon={Activity}
          color="purple"
          delay={0.2}
        />
        
        <MetricCard
          title="Recent Activity"
          value={summary.recentEvents.toLocaleString()}
          change={hourlyActivity}
          icon={Globe}
          color="orange"
          delay={0.3}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceBreakdown deviceStats={summary.deviceStats} />
        <EventTypesBreakdown eventTypes={summary.eventTypes} />
      </div>
    </div>
  )
}