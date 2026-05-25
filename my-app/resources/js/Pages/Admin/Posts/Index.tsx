import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MarkdownPreview from '@/Components/MarkdownPreview';
import Modal from '@/Components/Modal';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Post = {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    body: string;
    guideline_notes?: string | null;
    hero_image_url?: string | null;
    status: 'pending' | 'approved' | 'rejected';
    author?: { name: string; email: string };
};

export default function Index({ auth, posts }: PageProps<{ posts: Post[] }>) {
    const [filter, setFilter] = useState<'all' | 'approved' | 'unapproved'>('all');
    const approvedCount = posts.filter((post) => post.status === 'approved').length;
    const unapprovedCount = posts.length - approvedCount;
    const visiblePosts = posts.filter((post) => {
        if (filter === 'approved') {
            return post.status === 'approved';
        }

        if (filter === 'unapproved') {
            return post.status !== 'approved';
        }

        return true;
    });

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-semibold text-gray-800">Blog approvals</h2>}>
            <Head title="Blog approvals" />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Review submissions and published approvals.</p>
                        <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">{approvedCount} approved / {unapprovedCount} unapproved</p>
                    </div>
                    <div className="flex rounded-md border border-gray-200 bg-white p-1 text-sm shadow-sm">
                        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
                        <FilterButton active={filter === 'unapproved'} onClick={() => setFilter('unapproved')}>Unapproved</FilterButton>
                        <FilterButton active={filter === 'approved'} onClick={() => setFilter('approved')}>Approved</FilterButton>
                    </div>
                </div>
                <div className="space-y-4">
                    {visiblePosts.map((post) => <ApprovalCard key={post.id} post={post} />)}
                    {visiblePosts.length === 0 && <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm">No posts match this filter.</div>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded px-4 py-2 font-medium transition ${active ? 'bg-[#201713] text-white' : 'text-gray-600 hover:text-[#201713]'}`}
        >
            {children}
        </button>
    );
}

function ApprovalCard({ post }: { post: Post }) {
    const [reading, setReading] = useState(false);

    const update = (status: Post['status']) => {
        router.patch(route('admin.posts.update', post.slug), { status }, { preserveScroll: true });
    };

    return (
        <>
            <article className={`rounded-lg bg-white p-6 shadow-sm ${post.status === 'approved' ? 'border-2 border-green-500/40 ring-4 ring-green-50' : 'border border-transparent'}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-xs uppercase tracking-widest text-gray-500">{post.category} · {post.author?.name}</p>
                            <StatusBadge status={post.status} />
                        </div>
                        <h3 className="mt-2 text-2xl font-semibold text-gray-900">{post.title}</h3>
                        <p className="mt-3 max-w-3xl leading-7 text-gray-600">{post.excerpt}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <button type="button" onClick={() => setReading(true)} className="text-sm font-medium text-[#682738] hover:underline">
                                Read submission
                            </button>
                            {post.status === 'approved' && <Link href={route('journal.show', post.slug)} className="text-sm text-[#682738] hover:underline">View public post</Link>}
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                        <button onClick={() => update('approved')} className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white">Approve</button>
                        <button onClick={() => update('rejected')} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white">Reject</button>
                        <button onClick={() => update('pending')} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800">Pending</button>
                    </div>
                </div>
                {post.status === 'approved' && (
                    <div className="mt-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                        Approved and visible in the public journal.
                    </div>
                )}
            </article>

            <Modal show={reading} maxWidth="5xl" onClose={() => setReading(false)}>
                <article className="max-h-[86vh] overflow-y-auto bg-[#f8f4ec] p-6 text-[#201713] sm:p-10">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.34em] text-[#682738]">{post.category}</p>
                            <h2 className="mt-4 font-serif text-5xl leading-none md:text-7xl">{post.title}</h2>
                            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#65584f]">{post.excerpt}</p>
                            <p className="mt-4 text-sm text-[#8b735d]">By {post.author?.name ?? 'Cellar Circle'}{post.author?.email ? ` · ${post.author.email}` : ''}</p>
                        </div>
                        <button type="button" onClick={() => setReading(false)} className="rounded-md bg-white px-3 py-2 text-sm text-[#682738] shadow-sm hover:bg-[#fffaf1]">
                            Close
                        </button>
                    </div>

                    {post.hero_image_url && <img className="mt-8 h-[28rem] w-full rounded-lg object-cover shadow-sm" src={post.hero_image_url} alt="" />}

                    <MarkdownPreview body={post.body} className="mt-10 text-lg" />

                    {post.guideline_notes && (
                        <aside className="mt-10 rounded-lg border border-[#201713]/10 bg-white/70 p-5">
                            <p className="text-xs uppercase tracking-[0.28em] text-[#8b735d]">Editorial notes</p>
                            <p className="mt-3 whitespace-pre-line leading-7 text-[#65584f]">{post.guideline_notes}</p>
                        </aside>
                    )}

                    <div className="mt-10 flex flex-wrap justify-end gap-2 border-t border-[#201713]/10 pt-6">
                        <button onClick={() => update('pending')} className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm">Pending</button>
                        <button onClick={() => update('rejected')} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white">Reject</button>
                        <button onClick={() => update('approved')} className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white">Approve</button>
                    </div>
                </article>
            </Modal>
        </>
    );
}

function StatusBadge({ status }: { status: Post['status'] }) {
    const styles = {
        approved: 'bg-green-100 text-green-800 ring-green-200',
        pending: 'bg-amber-100 text-amber-800 ring-amber-200',
        rejected: 'bg-red-100 text-red-800 ring-red-200',
    };

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ring-1 ${styles[status]}`}>
            {status}
        </span>
    );
}
