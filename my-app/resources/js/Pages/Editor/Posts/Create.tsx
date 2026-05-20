import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: '',
        excerpt: '',
        body: '',
        guideline_notes: '',
        hero_image: null as File | null,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('editor.posts.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-semibold text-gray-800">Create blog</h2>}>
            <Head title="Create blog" />
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.72fr_0.28fr] lg:px-8">
                <form onSubmit={submit} className="space-y-5 rounded-lg bg-white p-6 shadow-sm">
                    <Field label="Title" error={errors.title}>
                        <input className="w-full rounded-md border-gray-300" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                    </Field>
                    <Field label="Category" error={errors.category}>
                        <input className="w-full rounded-md border-gray-300" value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="Vineyard Notes, Cellar Design, Regional Briefing" />
                    </Field>
                    <Field label="Short excerpt" error={errors.excerpt}>
                        <textarea className="min-h-24 w-full rounded-md border-gray-300" value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} />
                    </Field>
                    <Field label="Hero image" error={errors.hero_image}>
                        <input className="w-full rounded-md border border-gray-300 p-2" type="file" accept="image/*" onChange={(e) => setData('hero_image', e.target.files?.[0] ?? null)} />
                    </Field>
                    <Field label="Blog body" error={errors.body}>
                        <textarea className="min-h-[420px] w-full rounded-md border-gray-300 font-mono text-sm leading-6" value={data.body} onChange={(e) => setData('body', e.target.value)} placeholder="Write the full story here. Use short paragraphs and clear section breaks." />
                    </Field>
                    <Field label="Editorial notes for admin approval" error={errors.guideline_notes}>
                        <textarea className="min-h-28 w-full rounded-md border-gray-300" value={data.guideline_notes} onChange={(e) => setData('guideline_notes', e.target.value)} placeholder="Mention sources, image credit, tasting claims, audience notes, or anything the approver should check." />
                    </Field>
                    <div className="flex items-center justify-between">
                        <Link href={route('editor.posts.index')} className="text-sm text-gray-600 hover:text-gray-900">Cancel</Link>
                        <button disabled={processing} className="rounded-md bg-[#682738] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">Submit for approval</button>
                    </div>
                </form>

                <aside className="rounded-lg bg-[#201713] p-6 text-[#fff8ec] shadow-sm">
                    <p className="text-xs uppercase tracking-[0.28em] text-[#c7a56d]">Guideline box</p>
                    <h3 className="mt-4 text-2xl font-semibold">Before submitting</h3>
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-white/80">
                        <li>Open with a strong place, person, question, or sensory detail.</li>
                        <li>Keep tasting notes responsible and avoid health claims.</li>
                        <li>Add image credit or source context in editorial notes.</li>
                        <li>Use the excerpt as a polished magazine summary.</li>
                        <li>Minimum body length is 300 characters.</li>
                    </ul>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
            {children}
            <InputError message={error} className="mt-2" />
        </label>
    );
}
