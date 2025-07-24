'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Clock, BookOpen, Shield, Wifi, AlertTriangle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPost, blogPosts, BlogPost } from '@/content/blog/posts'
import { useEffect, useState } from 'react'
import { trackShowEducation } from '@/lib/analytics'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: PageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      const foundPost = getBlogPost(resolvedParams.slug)
      setPost(foundPost || null)
      setLoading(false)
      
      // Track blog post view
      if (foundPost) {
        trackShowEducation()
      }
    }
    
    resolveParams()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  const categoryIcons = {
    'check-explained': Shield,
    'security-basics': Wifi,
    'tips': AlertTriangle
  }

  const categoryColors = {
    'check-explained': 'text-blue-400',
    'security-basics': 'text-green-400',
    'tips': 'text-yellow-400'
  }

  const Icon = categoryIcons[post.category]
  const categoryColor = categoryColors[post.category]

  // Get related posts
  const relatedPosts = blogPosts.filter(p => 
    p.id !== post.id && 
    (p.category === post.category || 
     p.relatedChecks.some(check => post.relatedChecks.includes(check)))
  ).slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Icon className={`h-5 w-5 ${categoryColor}`} />
            <span className={`text-sm font-medium ${categoryColor}`}>
              {post.category === 'check-explained' ? 'Security Check Explained' :
               post.category === 'security-basics' ? 'Security Basics' :
               'Tips & Best Practices'}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-slate-400 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Published {new Date(post.publishedAt).toLocaleDateString()}
            </div>
          </div>

          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            {post.summary}
          </p>
        </motion.article>

        {/* Article content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-8 border border-slate-600/50 shadow-xl mb-8"
        >
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold text-white mt-8 mb-6 first:mt-0">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold text-white mt-8 mb-5">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold text-white mt-6 mb-4">{children}</h3>,
                p: ({children}) => <p className="text-slate-200 mb-5 leading-relaxed text-base">{children}</p>,
                ul: ({children}) => <ul className="text-slate-200 mb-5 space-y-2">{children}</ul>,
                ol: ({children}) => <ol className="text-slate-200 mb-5 space-y-2 list-decimal list-inside">{children}</ol>,
                li: ({children}) => <li className="text-slate-200 leading-relaxed flex gap-3"><span className="text-blue-400 mt-1">•</span><span>{children}</span></li>,
                strong: ({children}) => <strong className="text-blue-400 font-semibold">{children}</strong>,
                em: ({children}) => <em className="text-slate-300 italic bg-slate-700/30 px-2 py-1 rounded">{children}</em>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-slate-700/30 rounded-r text-slate-300 italic mb-5">{children}</blockquote>,
                code: ({children}) => <code className="bg-slate-700/50 px-2 py-1 rounded text-blue-300 text-sm font-mono">{children}</code>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.div>

        {/* Try WiFi Guard CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to check your WiFi security?
              </h3>
              <p className="text-slate-300">
                Use WiFi Guard to scan your current network and see these checks in action.
              </p>
            </div>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Try WiFi Guard
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link href={`/blog/${relatedPost.id}`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <Clock className="h-4 w-4" />
                        {relatedPost.readTime}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-slate-300 text-sm">
                        {relatedPost.summary}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}