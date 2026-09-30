import { useState } from 'react'
import { Globe, Smartphone, Monitor, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface WordPressSeoPanelProps {
  title: string
  slug: string
  content: string
  seoTitle: string
  seoDescription: string
  focusKeyword: string
  canonicalUrl: string
  schemaType?: string
  onChange: (fields: {
    seoTitle?: string
    seoDescription?: string
    focusKeyword?: string
    canonicalUrl?: string
    schemaType?: string
  }) => void
}

export function WordPressSeoPanel({
  title,
  slug,
  content,
  seoTitle,
  seoDescription,
  focusKeyword,
  canonicalUrl,
  schemaType = 'Article',
  onChange,
}: WordPressSeoPanelProps) {
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop')

  const displayTitle = seoTitle || title || 'Post Title'
  const displaySlug = slug || 'post-slug'
  const displayDescription =
    seoDescription ||
    (content
      ? content.replace(/<[^>]*>/g, ' ').substring(0, 155) + '...'
      : 'Provide a compelling meta description to improve click-through rates from search engine results.')

  // SEO Scorecard checks
  const cleanKeyword = focusKeyword.trim().toLowerCase()
  const keywordInTitle = cleanKeyword ? displayTitle.toLowerCase().includes(cleanKeyword) : false
  const keywordInSlug = cleanKeyword ? displaySlug.toLowerCase().includes(cleanKeyword.replace(/\s+/g, '-')) : false
  const keywordInDesc = cleanKeyword ? displayDescription.toLowerCase().includes(cleanKeyword) : false

  const textOnly = content ? content.replace(/<[^>]*>/g, ' ') : ''
  const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length
  const keywordOccurrences = cleanKeyword && textOnly
    ? (textOnly.toLowerCase().match(new RegExp(cleanKeyword, 'g')) || []).length
    : 0
  const keywordDensity = wordCount > 0 ? ((keywordOccurrences / wordCount) * 100).toFixed(1) : '0'

  const hasGoodWordCount = wordCount >= 300
  const isTitleLengthGood = displayTitle.length >= 40 && displayTitle.length <= 65
  const isDescLengthGood = displayDescription.length >= 120 && displayDescription.length <= 160

  const totalChecks = [keywordInTitle, keywordInSlug, keywordInDesc, hasGoodWordCount, isTitleLengthGood, isDescLengthGood]
  const passedChecks = totalChecks.filter(Boolean).length
  const scorePercent = Math.round((passedChecks / totalChecks.length) * 100)

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-primary-400" />
          <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)]">
            Yoast & RankMath SEO Suite
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">SEO Score:</span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              scorePercent >= 70
                ? 'bg-emerald-500/20 text-emerald-400'
                : scorePercent >= 40
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-red-500/20 text-red-400'
            }`}
          >
            {scorePercent}/100
          </span>
        </div>
      </div>

      {/* Google Search Snippet Preview */}
      <div className="mb-5 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
            Google Search Preview
          </span>
          <div className="flex items-center gap-1 rounded bg-[var(--color-surface)] p-0.5 border border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setDevicePreview('desktop')}
              className={`rounded p-1 text-xs ${
                devicePreview === 'desktop'
                  ? 'bg-primary-600 text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Desktop SERP Preview"
            >
              <Monitor className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevicePreview('mobile')}
              className={`rounded p-1 text-xs ${
                devicePreview === 'mobile'
                  ? 'bg-primary-600 text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Mobile SERP Preview"
            >
              <Smartphone className="size-3.5" />
            </button>
          </div>
        </div>

        <div className={`space-y-1 ${devicePreview === 'mobile' ? 'max-w-sm' : 'max-w-xl'}`}>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>https://orbit-i.tech</span>
            <span>›</span>
            <span className="text-emerald-400">blog</span>
            <span>›</span>
            <span className="truncate">{displaySlug}</span>
          </div>
          <h4 className="text-base font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
            {displayTitle} | ORBIT-I
          </h4>
          <p className="text-xs leading-relaxed text-zinc-400 line-clamp-2">
            {displayDescription}
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <label className="font-medium">SEO Meta Title</label>
            <span className={displayTitle.length > 60 ? 'text-amber-400' : 'text-zinc-500'}>
              {displayTitle.length}/60 chars
            </span>
          </div>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => onChange({ seoTitle: e.target.value })}
            placeholder={title || 'Custom search engine title...'}
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <label className="font-medium">SEO Meta Description</label>
            <span
              className={
                displayDescription.length > 160
                  ? 'text-red-400'
                  : displayDescription.length >= 120
                    ? 'text-emerald-400'
                    : 'text-zinc-500'
              }
            >
              {seoDescription.length}/160 chars
            </span>
          </div>
          <textarea
            rows={3}
            value={seoDescription}
            onChange={(e) => onChange({ seoDescription: e.target.value })}
            placeholder="Engaging summary for Google search result snippets..."
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-primary-500"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
              Focus Keyword / Keyphrase
            </label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => onChange({ focusKeyword: e.target.value })}
              placeholder="e.g. enterprise node.js software"
              className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
              Schema.org Structured Data
            </label>
            <select
              value={schemaType}
              onChange={(e) => onChange({ schemaType: e.target.value })}
              className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-primary-500"
            >
              <option value="TechArticle">TechArticle (Software/Engineering)</option>
              <option value="Article">Standard Article</option>
              <option value="BlogPosting">BlogPosting</option>
              <option value="NewsArticle">NewsArticle</option>
              <option value="WebPage">Corporate WebPage</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
            Canonical URL (leave blank for default permalink)
          </label>
          <input
            type="text"
            value={canonicalUrl}
            onChange={(e) => onChange({ canonicalUrl: e.target.value })}
            placeholder="https://orbit-i.tech/blog/original-post-slug"
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-primary-500"
          />
        </div>

        {/* Live On-Page SEO Checklist */}
        <div className="mt-4 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-3">
          <h4 className="mb-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            SEO Content Analysis
          </h4>
          <div className="grid gap-1.5 text-xs">
            <div className="flex items-center gap-2">
              {keywordInTitle ? (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="size-4 text-red-400 shrink-0" />
              )}
              <span className={keywordInTitle ? 'text-zinc-300' : 'text-zinc-500'}>
                Focus keyword present in SEO Title
              </span>
            </div>

            <div className="flex items-center gap-2">
              {keywordInDesc ? (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="size-4 text-red-400 shrink-0" />
              )}
              <span className={keywordInDesc ? 'text-zinc-300' : 'text-zinc-500'}>
                Focus keyword present in Meta Description
              </span>
            </div>

            <div className="flex items-center gap-2">
              {keywordInSlug ? (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="size-4 text-amber-400 shrink-0" />
              )}
              <span className={keywordInSlug ? 'text-zinc-300' : 'text-zinc-500'}>
                Focus keyword included in URL slug
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasGoodWordCount ? (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="size-4 text-amber-400 shrink-0" />
              )}
              <span className={hasGoodWordCount ? 'text-zinc-300' : 'text-zinc-500'}>
                Word count: {wordCount} words {hasGoodWordCount ? '(Good depth)' : '(Recommended >= 300)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span className="text-zinc-300">
                Keyword density: {keywordDensity}% ({keywordOccurrences} occurrences)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
