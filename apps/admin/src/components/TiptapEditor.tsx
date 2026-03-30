'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import { useEffect } from 'react'

interface TiptapEditorProps {
  content: Record<string, unknown> | null
  onChange: (json: Record<string, unknown>, html: string) => void
  placeholder?: string
}

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
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

export function TiptapEditor({ content, onChange, placeholder = 'Haber içeriğini yazın...' }: TiptapEditorProps) {
  const editor = useEditor({
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
      onChange(ed.getJSON() as Record<string, unknown>, ed.getHTML())
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

  return (
    <div className="rounded-md border bg-background">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
