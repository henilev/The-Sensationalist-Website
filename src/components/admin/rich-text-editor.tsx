"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useState } from "react";

export function RichTextEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [html, setHtml] = useState(defaultValue ?? "");

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: defaultValue ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[180px] outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  if (!editor) return null;

  const insertEmbed = () => {
    const url = window.prompt("Paste a YouTube, Vimeo, or Spotify link:");
    if (!url) return;
    const embedHtml = buildEmbedHtml(url);
    if (embedHtml) {
      editor.chain().focus().insertContent(embedHtml).run();
    } else {
      window.alert("Couldn't recognize that link. Supported: YouTube, Vimeo, Spotify.");
    }
  };

  const insertLink = () => {
    const url = window.prompt("Link URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t border border-b-0 border-ink/20 bg-ink/5 p-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          Heading
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} onClick={insertLink}>
          Link
        </ToolbarButton>
        <ToolbarButton onClick={insertEmbed}>Embed Video/Music</ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className="rounded-b border border-ink/20 bg-white px-3 py-2 text-sm"
      />
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-semibold ${
        active ? "bg-navy text-white" : "bg-white text-ink/70 hover:bg-ink/10"
      }`}
    >
      {children}
    </button>
  );
}

function buildEmbedHtml(url: string): string | null {
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (youtubeMatch) {
    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeMatch[1]}" frameborder="0" allowfullscreen></iframe>`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `<iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
  }
  if (url.includes("open.spotify.com")) {
    const embedUrl = url.replace("open.spotify.com/", "open.spotify.com/embed/");
    return `<iframe src="${embedUrl}" width="100%" height="152" frameborder="0" allow="encrypted-media"></iframe>`;
  }
  return null;
}
