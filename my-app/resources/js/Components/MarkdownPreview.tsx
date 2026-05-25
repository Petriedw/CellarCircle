import { Fragment, ReactNode } from 'react';

type Props = {
    body: string;
    className?: string;
};

export default function MarkdownPreview({ body, className = '' }: Props) {
    const blocks = parseBlocks(body);

    return (
        <div className={`space-y-6 ${className}`}>
            {blocks.length === 0 ? (
                <p className="text-[#8b735d]">Your formatted reading view will appear here.</p>
            ) : (
                blocks.map((block, index) => <Fragment key={index}>{block}</Fragment>)
            )}
        </div>
    );
}

function parseBlocks(body: string): ReactNode[] {
    const lines = body.replace(/\r\n/g, '\n').split('\n');
    const blocks: ReactNode[] = [];
    let paragraph: string[] = [];

    const flushParagraph = () => {
        if (paragraph.length === 0) {
            return;
        }

        blocks.push(<p className="leading-9 text-[#3f352f]">{parseInline(paragraph.join(' '))}</p>);
        paragraph = [];
    };

    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        const trimmed = line.trim();

        if (!trimmed) {
            flushParagraph();
            continue;
        }

        const image = trimmed.match(/^!\[(.*?)]\((.*?)\)$/);
        if (image) {
            flushParagraph();
            blocks.push(<img className="w-full rounded-lg object-cover shadow-sm" src={image[2]} alt={image[1]} />);
            continue;
        }

        const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (heading) {
            flushParagraph();
            const level = heading[1].length;
            const classes = level === 1
                ? 'font-serif text-5xl leading-none text-[#201713]'
                : level === 2
                    ? 'font-serif text-4xl leading-none text-[#201713]'
                    : 'font-serif text-3xl leading-tight text-[#201713]';
            const Tag = `h${Math.min(level + 1, 4)}` as keyof JSX.IntrinsicElements;
            blocks.push(<Tag className={classes}>{parseInline(heading[2])}</Tag>);
            continue;
        }

        if (trimmed.startsWith('> ')) {
            flushParagraph();
            blocks.push(
                <blockquote className="border-l-4 border-[#682738] pl-5 font-serif text-3xl leading-tight text-[#682738]">
                    {parseInline(trimmed.slice(2))}
                </blockquote>,
            );
            continue;
        }

        if (/^[-*]\s+/.test(trimmed)) {
            flushParagraph();
            const items: string[] = [];

            while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
                items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
                index++;
            }

            index--;
            blocks.push(
                <ul className="list-disc space-y-2 pl-6 leading-8 text-[#3f352f]">
                    {items.map((item) => <li key={item}>{parseInline(item)}</li>)}
                </ul>,
            );
            continue;
        }

        paragraph.push(trimmed);
    }

    flushParagraph();

    return blocks;
}

function parseInline(text: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    const pattern = /(!\[(.*?)]\((.*?)\)|\[(.*?)]\((.*?)\)|\*\*(.*?)\*\*|\*(.*?)\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }

        if (match[2] !== undefined) {
            nodes.push(<img className="my-4 w-full rounded-lg object-cover shadow-sm" src={match[3]} alt={match[2]} />);
        } else if (match[4] !== undefined) {
            nodes.push(<a className="text-[#682738] underline decoration-[#682738]/30 underline-offset-4 hover:text-[#201713]" href={match[5]}>{match[4]}</a>);
        } else if (match[6] !== undefined) {
            nodes.push(<strong className="font-semibold text-[#201713]">{match[6]}</strong>);
        } else if (match[7] !== undefined) {
            nodes.push(<em>{match[7]}</em>);
        }

        lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes;
}
