import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Post = {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    status: 'pending' | 'approved' | 'rejected';
    author?: { name: string; email: string };
};

export default function Index({ auth, posts }: PageProps<{ posts: Post[] }>) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-semibold text-gray-800">Blog approvals</h2>}>
            <Head title="Blog approvals" />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    {posts.map((post) => <ApprovalCard key={post.id} post={post} />)}
                    {posts.length === 0 && <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm">No submitted blogs yet.</div>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function ApprovalCard({ post }: { post: Post }) {
    const update = (status: Post['status']) => {
        router.patch(route('admin.posts.update', post.slug), { status }, { preserveScroll: true });
    };

    return (
        <article className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">{post.category} · {post.author?.name}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">{post.title}</h3>
                    <p className="mt-3 max-w-3xl leading-7 text-gray-600">{post.excerpt}</p>
                    {post.status === 'approved' && <Link href={route('journal.show', post.slug)} className="mt-4 inline-block text-sm text-[#682738] hover:underline">View public post</Link>}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                    <button onClick={() => update('approved')} className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white">Approve</button>
                    <button onClick={() => update('rejected')} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white">Reject</button>
                    <button onClick={() => update('pending')} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800">Pending</button>
                </div>
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-gray-500">Current status: {post.status}</p>
        </article>
    );
}
