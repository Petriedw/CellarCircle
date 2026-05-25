import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

type Post = {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    hero_image_url: string | null;
    approved_at: string | null;
    author?: { name: string };
};

type Props = {
    posts: {
        data: Post[];
    };
};

export default function Index({ posts }: Props) {
    return (
        <>
            <Head title="Journal" />
            <main className="min-h-screen bg-[#f8f4ec] text-[#201713]">
                <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 lg:px-10">
                    <Link href="/" className="flex items-center gap-3 font-serif text-2xl">
                        <ApplicationLogo className="h-14 w-14 rounded-full object-cover shadow-sm" />
                        <span>Cellar Circle</span>
                    </Link>
                    <Link href={route('login')} className="text-sm text-[#682738]">Login</Link>
                </header>
                <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10">
                    <p className="text-xs uppercase tracking-[0.34em] text-[#682738]">Public journal</p>
                    <h1 className="mt-5 max-w-4xl font-serif text-6xl leading-none tracking-tight md:text-8xl">Wine stories for slow reading.</h1>
                </section>
                <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-24 md:grid-cols-2 lg:grid-cols-3 lg:px-10">
                    {posts.data.map((post) => (
                        <Link key={post.id} href={route('journal.show', post.slug)} className="group rounded-lg border border-[#201713]/10 bg-white/65 p-4 shadow-sm transition hover:-translate-y-1 hover:bg-white">
                            {post.hero_image_url ? (
                                <img className="h-64 w-full rounded-md object-cover" src={post.hero_image_url} alt="" />
                            ) : (
                                <div className="h-64 rounded-md bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.7),transparent_25%),linear-gradient(135deg,#682738,#c7a56d)]" />
                            )}
                            <div className="px-2 py-5">
                                <p className="text-xs uppercase tracking-[0.24em] text-[#8b735d]">{post.category}</p>
                                <h2 className="mt-3 font-serif text-3xl leading-none">{post.title}</h2>
                                <p className="mt-4 leading-7 text-[#65584f]">{post.excerpt}</p>
                                <p className="mt-5 text-sm text-[#682738]">Read article →</p>
                            </div>
                        </Link>
                    ))}
                    {posts.data.length === 0 && <p className="col-span-full rounded-lg bg-white p-8 text-center text-[#65584f]">No approved stories have been published yet.</p>}
                </section>
            </main>
        </>
    );
}
