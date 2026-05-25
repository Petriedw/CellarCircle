import InputError from '@/Components/InputError';
import MarkdownPreview from '@/Components/MarkdownPreview';
import { ChangeEvent, useRef, useState } from 'react';

type Props = {
    value: string;
    error?: string;
    onChange: (value: string) => void;
};

export default function BlogBodyEditor({ value, error, onChange }: Props) {
    const [mode, setMode] = useState<'write' | 'preview'>('write');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const wordCount = countWords(value);
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));

    const insertText = (before: string, after = '', placeholder = '') => {
        const textarea = textareaRef.current;
        const start = textarea?.selectionStart ?? value.length;
        const end = textarea?.selectionEnd ?? value.length;
        const selected = value.slice(start, end) || placeholder;
        const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;

        onChange(next);

        window.requestAnimationFrame(() => {
            textarea?.focus();
            textarea?.setSelectionRange(start + before.length, start + before.length + selected.length);
        });
    };

    const insertLine = (prefix: string, placeholder: string) => {
        const textarea = textareaRef.current;
        const start = textarea?.selectionStart ?? value.length;
        const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
        const hasLineText = value.slice(lineStart, start).trim().length > 0;
        const insert = `${hasLineText ? '\n' : ''}${prefix}${placeholder}`;
        const next = `${value.slice(0, start)}${insert}${value.slice(start)}`;

        onChange(next);
        window.requestAnimationFrame(() => textarea?.focus());
    };

    const insertImage = (url: string, fileName: string) => {
        const textarea = textareaRef.current;
        const start = textarea?.selectionStart ?? value.length;
        const alt = imageAltFromFileName(fileName);
        const prefix = value && !value.endsWith('\n') ? '\n\n' : '';
        const markdown = `${prefix}![${alt}](${url})\n\n`;
        const next = `${value.slice(0, start)}${markdown}${value.slice(start)}`;

        setMode('preview');
        onChange(next);

        window.requestAnimationFrame(() => {
            textarea?.setSelectionRange(start + markdown.length, start + markdown.length);
        });
    };

    const uploadInlineImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        setUploadError(null);

        try {
            const response = await window.axios.post<{ url: string }>(route('editor.posts.images.store'), formData, {
                headers: { Accept: 'application/json' },
            });

            insertImage(response.data.url, file.name);
        } catch (error) {
            setUploadError('Image upload failed. Please use JPG, PNG, or WebP under 4 MB.');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    return (
        <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    <ToolbarButton onClick={() => insertText('**', '**', 'bold text')}>B</ToolbarButton>
                    <ToolbarButton onClick={() => insertText('*', '*', 'italic text')}>I</ToolbarButton>
                    <ToolbarButton onClick={() => insertLine('## ', 'Section heading')}>H</ToolbarButton>
                    <ToolbarButton onClick={() => insertLine('> ', 'Pull quote')}>Quote</ToolbarButton>
                    <ToolbarButton onClick={() => insertLine('- ', 'List item')}>List</ToolbarButton>
                    <ToolbarButton onClick={() => insertText('[', '](https://)', 'link text')}>Link</ToolbarButton>
                    <ToolbarButton onClick={() => imageInputRef.current?.click()} disabled={uploading}>
                        {uploading ? 'Uploading' : 'Image'}
                    </ToolbarButton>
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={uploadInlineImage} />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <p className="rounded-md border border-[#201713]/10 bg-white px-3 py-2 text-sm text-[#65584f]">
                        {wordCount.toLocaleString()} words / {readingMinutes} min read
                    </p>
                    <div className="flex rounded-md border border-[#201713]/10 bg-[#f8f4ec] p-1 text-sm">
                        <button type="button" className={`rounded px-3 py-1.5 ${mode === 'write' ? 'bg-[#201713] text-[#fff8ec]' : 'text-[#65584f]'}`} onClick={() => setMode('write')}>
                            Write
                        </button>
                        <button type="button" className={`rounded px-3 py-1.5 ${mode === 'preview' ? 'bg-[#201713] text-[#fff8ec]' : 'text-[#65584f]'}`} onClick={() => setMode('preview')}>
                            Reading view
                        </button>
                    </div>
                </div>
            </div>

            {mode === 'write' ? (
                <textarea
                    ref={textareaRef}
                    className="min-h-[520px] w-full rounded-md border-[#201713]/15 bg-[#fffaf1] font-mono text-sm leading-6 text-[#201713] shadow-sm focus:border-[#682738] focus:ring-[#682738]"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Write the full story here. Use the toolbar for headings, pull quotes, lists, links, bold text, and inline images."
                />
            ) : (
                <div className="min-h-[520px] rounded-md border border-[#201713]/10 bg-[#fffaf1] p-6">
                    <MarkdownPreview body={value} />
                </div>
            )}

            <InputError message={error} className="mt-2" />
            {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
        </div>
    );
}

function imageAltFromFileName(fileName: string) {
    return fileName
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim() || 'Article image';
}

function countWords(text: string) {
    const plainText = text
        .replace(/!\[.*?]\(.*?\)/g, ' ')
        .replace(/\[([^\]]+)]\(.*?\)/g, '$1')
        .replace(/[#>*_`-]/g, ' ');

    return plainText.trim().match(/\S+/g)?.length ?? 0;
}

function ToolbarButton({ children, disabled = false, onClick }: { children: string; disabled?: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="rounded-md border border-[#201713]/10 bg-white px-3 py-2 text-sm font-medium text-[#4f433d] shadow-sm transition hover:border-[#682738]/30 hover:text-[#682738] disabled:cursor-wait disabled:opacity-60"
        >
            {children}
        </button>
    );
}
