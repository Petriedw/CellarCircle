import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

type Stats = {
    approvedPosts: number;
    pendingPosts: number;
    accessRequests: number;
    subscribers: number;
    users: number;
};

export default function Dashboard({ auth, stats }: PageProps<{ stats: Stats }>) {
    const canAdmin = auth.user.role === 'head_admin' || auth.user.role === 'admin';
    const cards = [
        ['Approved blogs', stats.approvedPosts],
        ['Pending approval', stats.pendingPosts],
        ['Access requests', stats.accessRequests],
        ['Subscribers', stats.subscribers],
        ['Team members', stats.users],
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editorial dashboard</h2>}
        >
            <Head title="Editorial dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-5">
                        {cards.map(([label, value]) => (
                            <div key={label} className="rounded-lg bg-white p-6 shadow-sm">
                                <p className="text-sm text-gray-500">{label}</p>
                                <p className="mt-3 text-3xl font-semibold text-gray-900">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <Link href={route('editor.posts.create')} className="rounded-lg bg-[#682738] p-6 text-white shadow-sm transition hover:bg-[#4f1d2b]">
                            <p className="text-sm uppercase tracking-widest text-white/70">Write</p>
                            <h3 className="mt-3 text-2xl font-semibold">Create a blog</h3>
                            <p className="mt-2 text-sm leading-6 text-white/80">Use the guided editor and submit for approval.</p>
                        </Link>
                        <Link href={route('editor.posts.index')} className="rounded-lg bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
                            <p className="text-sm uppercase tracking-widest text-gray-500">Manage</p>
                            <h3 className="mt-3 text-2xl font-semibold text-gray-900">Your blogs</h3>
                            <p className="mt-2 text-sm leading-6 text-gray-600">Review drafts, pending work, and approved posts.</p>
                        </Link>
                        {canAdmin && (
                            <Link href={route('admin.posts.index')} className="rounded-lg bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
                                <p className="text-sm uppercase tracking-widest text-gray-500">Admin</p>
                                <h3 className="mt-3 text-2xl font-semibold text-gray-900">Approve blogs</h3>
                                <p className="mt-2 text-sm leading-6 text-gray-600">Publish or reject submissions from editors.</p>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
