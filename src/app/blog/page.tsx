'use client'

import { motion } from 'framer-motion'
import { BookOpen, Clock, ArrowRight, Shield, Wifi, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { blogPosts, BlogPost } from '@/content/blog/posts'

export default function BlogPage() {
  const categoryIcons = {
    'check-explained': Shield,
    'security-basics': Wifi,
    'tips': AlertTriangle
  }

  const categoryNames = {
    'check-explained': 'Security Checks Explained',
    'security-basics': 'Security Basics',
    'tips': 'Tips & Best Practices'
  }

  const categoryColors = {
    'check-explained': 'text-blue-400',
    'security-basics': 'text-green-400', 
    'tips': 'text-yellow-400'
  }

  const groupedPosts = blogPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = []
    }
    acc[post.category].push(post)
    return acc
  }, {} as Record<BlogPost['category'], BlogPost[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">WiFi Security Guide</h1>
          </div>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Understanding what WiFi Guard checks and how to stay safer on public networks
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to WiFi Guard
          </Link>
          
          <Link 
            href="/security-info"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Shield className="h-4 w-4" />
            Complete Security Guide
          </Link>
        </motion.div>

        {/* Blog post categories */}
        <div className="space-y-12">
          {Object.entries(groupedPosts).map(([category, posts], categoryIndex) => {
            const Icon = categoryIcons[category as BlogPost['category']]
            const categoryName = categoryNames[category as BlogPost['category']]
            const categoryColor = categoryColors[category as BlogPost['category']]

            return (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={`h-6 w-6 ${categoryColor}`} />
                  <h2 className="text-2xl font-bold text-white">{categoryName}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {posts.map((post, postIndex) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + categoryIndex * 0.1 + postIndex * 0.05 }}
                    >
                      <Link href={`/blog/${post.id}`}>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group h-full">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Clock className="h-4 w-4" />
                              {post.readTime}
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" />
                          </div>
                          
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-slate-300 leading-relaxed">
                            {post.summary}
                          </p>

                          {post.relatedChecks.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-700">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-400" />
                                <span className="text-sm text-slate-400">
                                  Explains: {post.relatedChecks.join(', ')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )
          })}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
            <p className="text-slate-400">
              Have questions about WiFi security? These guides explain what WiFi Guard checks
              and provide practical advice for staying safer on public networks.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}