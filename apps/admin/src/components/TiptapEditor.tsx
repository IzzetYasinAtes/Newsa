'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import { useEffect, useRef, useState } from 'react'

interface TiptapEditorProps {
  content: Record<string, unknown> | null
  onChange: (json: Record<string, unknown>, html: string) => void
  placeholder?: string
  onAutoSave?: (content: Record<string, unknown>) => void
}

type AutoSaveStatus = 'idle' | 'saving' | 'saved'

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> | null }) {
  if (!editor) return null

  const btnClass = (active: boolean) =>
    `rounded px-2 py-1 text-sm ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`

  return (
    <div className="flex flex-wrap gap-1 border-b p-2">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>
        <strong>B</strong>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>
        <em>I</em>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}>
        <u>U</u>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))}>
        <s>S</s>
      </button>
      <span className="mx-1 border-r" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))}>
        H3
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={btnClass(editor.isActive('heading', { level: 4 }))}>
        H4
      </button>
      <span className="mx-1 border-r" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>
        &bull; Liste
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>
        1. Liste
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}>
        &ldquo; Alıntı
      </button>
      <span className="mx-1 border-r" />
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))}>
        Sola
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))}>
        Orta
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))}>
        Sağa
      </button>
      <span className="mx-1 border-r" />
      <button
        type="button"
        onClick={() => {
          const url = prompt('Link URL:')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}
        className={btnClass(editor.isActive('link'))}
      >
        Link
      </button>
      <button
        type="button"
        onClick={() => {
          const url = prompt('Görsel URL:')
          if (url) editor.chain().focus().setImage({ src: url }).run()
        }}
        className="rounded px-2 py-1 text-sm hover:bg-muted"
      >
        Görsel
      </button>
      <button
        type="button"
        onClick={() => {
          const url = prompt('YouTube URL:')
          if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }}
        className="rounded px-2 py-1 text-sm hover:bg-muted"
      >
        Video
      </button>
      <span className="mx-1 border-r" />
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="rounded px-2 py-1 text-sm hover:bg-muted">
        — Ayraç
      </button>
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="rounded px-2 py-1 text-sm hover:bg-muted disabled:opacity-30">
        Geri
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="rounded px-2 py-1 text-sm hover:bg-muted disabled:opacity-30">
        İleri
      </button>
    </div>
  )
}

export function TiptapEditor({ content, onChange, placeholder = 'Haber içeriğini yazın...', onAutoSave }: TiptapEditorProps) {
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle')
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ width: 640, height: 360 }),
    ],
    content: content ?? undefined,
    onUpdate: ({ editor: ed }) => {
      const json = ed.getJSON() as Record<string, unknown>
      const html = ed.getHTML()
      onChange(json, html)

      // Auto-save debounce: 30 saniye
      if (onAutoSave) {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
        setAutoSaveStatus('idle')
        autoSaveTimerRef.current = setTimeout(() => {
          setAutoSaveStatus('saving')
          onAutoSave(json)
          // "Kaydedildi" durumu için kısa süre sonra idle'a dön
          if (savedStatusTimerRef.current) clearTimeout(savedStatusTimerRef.current)
          savedStatusTimerRef.current = setTimeout(() => {
            setAutoSaveStatus('saved')
            setTimeout(() => setAutoSaveStatus('idle'), 3000)
          }, 500)
        }, 30000)
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      const currentJSON = JSON.stringify(editor.getJSON())
      const newJSON = JSON.stringify(content)
      if (currentJSON !== newJSON) {
        editor.commands.setContent(content)
      }
    }
  }, [content, editor])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
      if (savedStatusTimerRef.current) clearTimeout(savedStatusTimerRef.current)
    }
  }, [])

  return (
    <div className="rounded-md border bg-background">
      <div className="flex items-center justify-between">
        <MenuBar editor={editor} />
        {onAutoSave && autoSaveStatus !== 'idle' && (
          <div className="mr-2 flex-shrink-0">
            {autoSaveStatus === 'saving' && (
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                Kaydediliyor...
              </span>
            )}
            {autoSaveStatus === 'saved' && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                Otomatik kaydedildi
              </span>
            )}
          </div>
        )}
      </div>
      {editor && <EditorContent editor={editor} />}
    </div>
  )
}
