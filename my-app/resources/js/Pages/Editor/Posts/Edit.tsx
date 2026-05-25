import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import BlogBodyEditor from '@/Components/BlogBodyEditor';
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
                    <Field label="Replace hero image" error={errors.hero_image}><HeroImageInput file={data.hero_image} onChange={(file) => setData('hero_image', file)} /></Field>
                    <div>
                        <span className="mb-2 block text-sm font-medium text-gray-700">Blog body</span>
                        <BlogBodyEditor value={data.body} error={errors.body} onChange={(value) => setData('body', value)} />
                    </div>
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

function HeroImageInput({ file, onChange }: { file: File | null; onChange: (file: File | null) => void }) {
    return (
        <div className="rounded-lg border border-dashed border-[#682738]/30 bg-[#f8f4ec] p-5">
            <label className="inline-flex cursor-pointer items-center rounded-md bg-[#682738] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#4f1d2b]">
                Choose hero image
                <input className="hidden" type="file" accept="image/*" onChange={(event) => onChange(event.target.files?.[0] ?? null)} />
            </label>
            <p className="mt-3 text-sm text-[#65584f]">
                {file ? file.name : 'Upload a replacement cover image.'}
            </p>
        </div>
    );
}
