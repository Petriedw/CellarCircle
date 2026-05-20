import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Post = {
    id: number;
    title: string;
    slug: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    author?: { name: string };
};

export default function Index({ auth, posts }: PageProps<{ posts: Post[] }>) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-semibold text-gray-800">Blogs</h2>}>
            <Head title="Blogs" />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Create, edit, and track approval status.</p>
                    <Link href={route('editor.posts.create')} className="rounded-md bg-[#682738] px-4 py-2 text-sm font-medium text-white">New blog</Link>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr><th className="p-4">Title</th><th className="p-4">Category</th><th className="p-4">Author</th><th className="p-4">Status</th><th className="p-4"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td className="p-4 font-medium text-gray-900">{post.title}</td>
                                    <td className="p-4 text-gray-600">{post.category}</td>
                                    <td className="p-4 text-gray-600">{post.author?.name ?? auth.user.name}</td>
                                    <td className="p-4"><Status status={post.status} /></td>
                                    <td className="p-4 text-right">
                                        <Link href={route('editor.posts.edit', post.slug)} className="text-[#682738] hover:underline">Edit</Link>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No blogs yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Status({ status }: { status: Post['status'] }) {
    const colors = {
        approved: 'bg-green-50 text-green-700',
        pending: 'bg-amber-50 text-amber-700',
        rejected: 'bg-red-50 text-red-700',
    };

    return <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${colors[status]}`}>{status}</span>;
}
