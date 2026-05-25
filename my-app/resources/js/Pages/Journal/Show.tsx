import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import MarkdownPreview from '@/Components/MarkdownPreview';

type Post = {
    title: string;
    category: string;
    excerpt: string;
    body: string;
    hero_image_url: string | null;
    approved_at: string | null;
    author?: { name: string };
};

export default function Show({ post }: { post: Post }) {
    return (
        <>
            <Head title={post.title} />
            <main className="min-h-screen bg-[#f8f4ec] text-[#201713]">
                <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
                    <Link href={route('journal.index')} className="text-sm text-[#682738]">← Journal</Link>
                    <Link href="/" className="inline-flex">
                        <ApplicationLogo className="h-14 w-auto shadow-sm" />
                    </Link>
                </header>
                <article className="mx-auto max-w-5xl px-6 pb-24">
                    <p className="text-xs uppercase tracking-[0.34em] text-[#682738]">{post.category}</p>
                    <h1 className="mt-5 font-serif text-5xl leading-none tracking-tight md:text-8xl">{post.title}</h1>
                    <p className="mt-6 max-w-3xl text-xl leading-9 text-[#65584f]">{post.excerpt}</p>
                    <p className="mt-6 text-sm text-[#8b735d]">By {post.author?.name ?? 'Cellar Circle'}{post.approved_at ? ` · ${post.approved_at}` : ''}</p>
                    {post.hero_image_url && <img className="mt-10 h-[28rem] w-full rounded-lg object-cover shadow-sm" src={post.hero_image_url} alt="" />}
                    <MarkdownPreview body={post.body} className="mt-12 text-lg" />
                </article>
            </main>
        </>
    );
}
