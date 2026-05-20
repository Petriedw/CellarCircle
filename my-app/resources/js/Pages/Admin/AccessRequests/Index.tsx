import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

type AccessRequest = {
    id: number;
    name: string;
    email: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
};

export default function Index({ auth, requests }: PageProps<{ requests: AccessRequest[] }>) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-semibold text-gray-800">Access requests</h2>}>
            <Head title="Access requests" />
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-4">
                    {requests.map((request) => <RequestCard key={request.id} request={request} />)}
                    {requests.length === 0 && <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm">No access requests yet.</div>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function RequestCard({ request }: { request: AccessRequest }) {
    const { data, setData, transform, patch, processing, errors } = useForm({
        role: 'editor',
        password: '',
    });

    const approve = () => {
        transform((formData) => ({ ...formData, status: 'approved' }));
        patch(route('admin.access-requests.update', request.id), { preserveScroll: true });
    };

    const reject = () => {
        router.patch(route('admin.access-requests.update', request.id), { status: 'rejected' }, { preserveScroll: true });
    };

    return (
        <article className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">{request.status}</p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">{request.name}</h3>
                    <p className="text-sm text-gray-600">{request.email}</p>
                    <p className="mt-4 max-w-3xl leading-7 text-gray-700">{request.reason}</p>
                </div>
                {request.status === 'pending' && (
                    <div className="w-full shrink-0 space-y-3 md:w-72">
                        <select className="w-full rounded-md border-gray-300 text-sm" value={data.role} onChange={(e) => setData('role', e.target.value)}>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                        <InputError message={errors.role} />
                        <input className="w-full rounded-md border-gray-300 text-sm" placeholder="Temporary password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        <InputError message={errors.password} />
                        <div className="flex gap-2">
                            <button disabled={processing} onClick={approve} className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Approve</button>
                            <button type="button" onClick={reject} className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white">Reject</button>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
