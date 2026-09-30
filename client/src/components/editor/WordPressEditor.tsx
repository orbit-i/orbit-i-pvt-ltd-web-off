import { useState, useEffect, useRef, type ReactNode } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  Maximize2,
  Minimize2,
  Code2,
  Eye,
  Minus,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react'

interface WordPressEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

function ToolbarButton({
  label,
  onClick,
  active = false,
  disabled = false,
  children,
}: {
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex size-8 items-center justify-center rounded border text-xs transition-colors ${
        disabled
          ? 'cursor-not-allowed border-transparent text-[var(--color-text-muted)]/40'
          : active
            ? 'border-primary-500 bg-primary-500/20 font-semibold text-primary-300'
            : 'border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
      }`}
    >
      {children}
    </button>
  )
}

export function WordPressEditor({
  value,
  onChange,
  placeholder = 'Start writing or paste HTML content...',
  minHeight = '360px',
}: WordPressEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rawHtml, setRawHtml] = useState(value)
  const isUpdatingFromEditor = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md border border-[var(--color-border)] my-4 max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-primary-400 underline underline-offset-4 hover:text-primary-300 font-medium',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full my-4 border-collapse border border-[var(--color-border)] text-sm',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-[var(--color-border)]',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-[var(--color-surface-hover)] p-2 text-left font-semibold border-r border-[var(--color-border)] text-[var(--color-text-primary)]',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2 border-r border-[var(--color-border)] text-[var(--color-text-secondary)]',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor: cur }) => {
      isUpdatingFromEditor.current = true
      const html = cur.getHTML()
      setRawHtml(html)
      onChange(html)
      setTimeout(() => {
        isUpdatingFromEditor.current = false
      }, 0)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-4 outline-none focus:outline-none text-[var(--color-text-primary)] leading-relaxed',
        style: `min-height: ${minHeight}; word-break: break-word;`,
      },
    },
  })

  // Sync external value changes into editor
  useEffect(() => {
    if (editor && !isUpdatingFromEditor.current && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>')
      setRawHtml(value)
    }
  }, [editor, value])

  const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setRawHtml(val)
    onChange(val)
    if (editor) {
      editor.commands.setContent(val)
    }
  }

  const handleAddImage = (ed: Editor) => {
    const url = window.prompt('Enter Image URL (or upload to CDN):')
    if (!url?.trim()) return
    const alt = window.prompt('Enter image alt description (for SEO & accessibility):') || ''
    ed.chain().focus().setImage({ src: url.trim(), alt: alt.trim() }).run()
  }

  const handleAddLink = (ed: Editor) => {
    const prev = ed.getAttributes('link').href || ''
    const url = window.prompt('Enter URL link (e.g. https://... or /services):', prev)
    if (url === null) return
    if (!url.trim()) {
      ed.chain().focus().unsetLink().run()
      return
    }
    const isExternal = url.startsWith('http://') || url.startsWith('https://')
    ed.chain().focus().setLink({ href: url.trim(), target: isExternal ? '_blank' : null }).run()
  }

  const handleInsertButton = (ed: Editor) => {
    const text = window.prompt('Enter Button Text (e.g., "Contact Us" or "View Architecture"):')
    const href = window.prompt('Enter Button Link (e.g., "/contact"):')
    if (!text?.trim() || !href?.trim()) return
    ed.chain().focus().insertContent(
      `<p><a href="${href.trim()}" class="inline-block px-5 py-2.5 rounded bg-primary-600 hover:bg-primary-500 text-white font-medium text-sm no-underline transition-colors">${text.trim()}</a></p><p></p>`
    ).run()
  }

  const wordCount = rawHtml
    ? rawHtml.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
    : 0
  const charCount = rawHtml ? rawHtml.replace(/<[^>]*>/g, '').length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div
      className={`flex flex-col border border-[var(--color-border)] bg-[var(--color-surface)] transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none bg-[var(--color-surface)]'
          : 'rounded-[var(--radius-md)]'
      }`}
    >
      {/* WordPress Top Mode & Control Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5">
        <div className="flex items-center gap-1">
          <span className="mr-2 text-xs font-semibold tracking-wide text-primary-400 uppercase">
            WordPress Visual Studio
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === 'visual'
                ? 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Eye className="size-3.5" /> Visual
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === 'code'
                ? 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Code2 className="size-3.5" /> HTML / Code
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{readingTime} min read</span>
          <button
            type="button"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="ml-2 rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* WordPress Formatting Toolbar (Active in Visual mode) */}
      {activeTab === 'visual' && editor && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--color-border)] bg-[var(--color-surface)] p-1.5">
          {/* Block Level Selector */}
          <select
            value={
              editor.isActive('heading', { level: 1 })
                ? 'h1'
                : editor.isActive('heading', { level: 2 })
                  ? 'h2'
                  : editor.isActive('heading', { level: 3 })
                    ? 'h3'
                    : editor.isActive('heading', { level: 4 })
                      ? 'h4'
                      : 'p'
            }
            onChange={(e) => {
              const val = e.target.value
              if (val === 'p') editor.chain().focus().setParagraph().run()
              else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run()
              else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run()
              else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run()
              else if (val === 'h4') editor.chain().focus().toggleHeading({ level: 4 }).run()
            }}
            className="mr-1 h-8 rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 text-xs font-medium text-[var(--color-text-primary)] outline-none"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1 (H1)</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3)</option>
            <option value="h4">Heading 4 (H4)</option>
          </select>

          <span className="mx-1 h-4 w-px bg-[var(--color-border)]" />

          {/* Typography */}
          <ToolbarButton
            label="Bold (Ctrl+B)"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic (Ctrl+I)"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Underline (Ctrl+U)"
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Inline Code"
            active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="size-3.5" />
          </ToolbarButton>

          <span className="mx-1 h-4 w-px bg-[var(--color-border)]" />

          {/* Lists & Quotes */}
          <ToolbarButton
            label="Bulleted list"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Blockquote"
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Code Block"
            active={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code2 className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Horizontal Rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="size-3.5" />
          </ToolbarButton>

          <span className="mx-1 h-4 w-px bg-[var(--color-border)]" />

          {/* Media & Links */}
          <ToolbarButton
            label="Insert Link"
            active={editor.isActive('link')}
            onClick={() => handleAddLink(editor)}
          >
            <LinkIcon className="size-3.5" />
          </ToolbarButton>
          {editor.isActive('link') && (
            <ToolbarButton
              label="Remove Link"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <Unlink className="size-3.5" />
            </ToolbarButton>
          )}
          <ToolbarButton
            label="Insert Image"
            onClick={() => handleAddImage(editor)}
          >
            <ImageIcon className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Insert CTA Button"
            onClick={() => handleInsertButton(editor)}
          >
            <Sparkles className="size-3.5 text-primary-400" />
          </ToolbarButton>

          <span className="mx-1 h-4 w-px bg-[var(--color-border)]" />

          {/* Table Operations */}
          <ToolbarButton
            label="Insert Table"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          >
            <TableIcon className="size-3.5" />
          </ToolbarButton>
          {editor.isActive('table') && (
            <>
              <ToolbarButton
                label="Add Row Below"
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                <Plus className="size-3.5" />
              </ToolbarButton>
              <ToolbarButton
                label="Add Column After"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              >
                <Plus className="size-3.5" />
              </ToolbarButton>
              <ToolbarButton
                label="Delete Table"
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                <Trash2 className="size-3.5 text-danger-400" />
              </ToolbarButton>
            </>
          )}

          <div className="ml-auto flex items-center gap-0.5">
            <ToolbarButton
              label="Undo (Ctrl+Z)"
              disabled={!editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo2 className="size-3.5" />
            </ToolbarButton>
            <ToolbarButton
              label="Redo (Ctrl+Y)"
              disabled={!editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo2 className="size-3.5" />
            </ToolbarButton>
          </div>
        </div>
      )}

      {/* Editor Body Area */}
      <div className="relative flex-1 overflow-auto bg-[var(--color-surface)]">
        {activeTab === 'visual' ? (
          <div className="w-full">
            <EditorContent editor={editor} />
          </div>
        ) : (
          <textarea
            value={rawHtml}
            onChange={handleRawHtmlChange}
            placeholder={placeholder}
            spellCheck={false}
            className="h-full w-full resize-y bg-[var(--color-background)] p-4 font-mono text-xs leading-relaxed text-emerald-400 outline-none"
            style={{ minHeight: isFullscreen ? 'calc(100vh - 120px)' : minHeight }}
          />
        )}
      </div>

      {/* WordPress Status Footer */}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-background)] px-4 py-1.5 text-[11px] text-[var(--color-text-muted)]">
        <div className="flex items-center gap-3">
          <span>Path: p {editor?.isActive('heading') ? '› heading' : ''} {editor?.isActive('table') ? '› table' : ''}</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>
        <div>
          <span>Hostinger CMS Ready • Clean HTML Cleanse</span>
        </div>
      </div>
    </div>
  )
}
