import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

type Post = {
    title: string;
    category: string;
    excerpt: string;
    body: string;
    guideline_notes: string | null;
    hero_image_url: string | null;
    slug: string;
};

export default function Edit({ auth, post: blog }: PageProps<{ post: Post }>) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'patch',
        title: blog.title,
        category: blog.category,
        excerpt: blog.excerpt,
        body: blog.body,
        guideline_notes: blog.guideline_notes ?? '',
        hero_image: null as File | null,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('editor.posts.update', blog.slug), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-semibold text-gray-800">Edit blog</h2>}>
            <Head title="Edit blog" />
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-5 rounded-lg bg-white p-6 shadow-sm">
                    <Field label="Title" error={errors.title}><input className="w-full rounded-md border-gray-300" value={data.title} onChange={(e) => setData('title', e.target.value)} /></Field>
                    <Field label="Category" error={errors.category}><input className="w-full rounded-md border-gray-300" value={data.category} onChange={(e) => setData('category', e.target.value)} /></Field>
                    <Field label="Short excerpt" error={errors.excerpt}><textarea className="min-h-24 w-full rounded-md border-gray-300" value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} /></Field>
                    {blog.hero_image_url && <img src={blog.hero_image_url} alt="" className="h-56 w-full rounded-lg object-cover" />}
                    <Field label="Replace hero image" error={errors.hero_image}><input className="w-full rounded-md border border-gray-300 p-2" type="file" accept="image/*" onChange={(e) => setData('hero_image', e.target.files?.[0] ?? null)} /></Field>
                    <Field label="Blog body" error={errors.body}><textarea className="min-h-[420px] w-full rounded-md border-gray-300 font-mono text-sm leading-6" value={data.body} onChange={(e) => setData('body', e.target.value)} /></Field>
                    <Field label="Editorial notes" error={errors.guideline_notes}><textarea className="min-h-28 w-full rounded-md border-gray-300" value={data.guideline_notes} onChange={(e) => setData('guideline_notes', e.target.value)} /></Field>
                    <div className="flex items-center justify-between">
                        <Link href={route('editor.posts.index')} className="text-sm text-gray-600 hover:text-gray-900">Cancel</Link>
                        <button disabled={processing} className="rounded-md bg-[#682738] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">Save and resubmit</button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>{children}<InputError message={error} className="mt-2" /></label>;
}
