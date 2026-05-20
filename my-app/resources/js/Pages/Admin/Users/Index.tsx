import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Role = 'head_admin' | 'admin' | 'editor';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: Role;
};

export default function Index({ auth, users }: PageProps<{ users: UserRow[] }>) {
    const canCreateHeadAdmin = auth.user.role === 'head_admin';
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'editor',
        password: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.users.store'), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-semibold text-gray-800">Editors and admins</h2>}>
            <Head title="Editors and admins" />
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.35fr_0.65fr] lg:px-8">
                <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900">Add person</h3>
                    <input className="w-full rounded-md border-gray-300" placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    <InputError message={errors.name} />
                    <input className="w-full rounded-md border-gray-300" placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    <InputError message={errors.email} />
                    <select className="w-full rounded-md border-gray-300" value={data.role} onChange={(e) => setData('role', e.target.value)}>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                        {canCreateHeadAdmin && <option value="head_admin">Head admin</option>}
                    </select>
                    <InputError message={errors.role} />
                    <input className="w-full rounded-md border-gray-300" placeholder="Temporary password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    <InputError message={errors.password} />
                    <button disabled={processing} className="w-full rounded-md bg-[#682738] px-4 py-3 text-sm font-medium text-white disabled:opacity-50">Add user</button>
                </form>

                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => <UserRowEditor key={user.id} user={user} currentUser={auth.user} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function UserRowEditor({ user, currentUser }: { user: UserRow; currentUser: { id: number; role: Role } }) {
    const { data, setData, patch, processing } = useForm({ role: user.role });
    const canEditHeadAdmin = currentUser.role === 'head_admin';
    const isCurrentUser = currentUser.id === user.id;
    const isProtected = user.role === 'head_admin';
    const canRemove = !isCurrentUser && !isProtected;

    const remove = () => {
        if (!canRemove || !window.confirm(`Remove ${user.name}?`)) {
            return;
        }

        router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
    };

    return (
        <tr>
            <td className="p-4 font-medium text-gray-900">{user.name}</td>
            <td className="p-4 text-gray-600">{user.email}</td>
            <td className="p-4">
                <select
                    className="rounded-md border-gray-300 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    disabled={isProtected}
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value as Role)}
                >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                    {(canEditHeadAdmin || user.role === 'head_admin') && <option value="head_admin">Head admin</option>}
                </select>
                {isProtected && <p className="mt-1 text-xs text-gray-500">Protected</p>}
            </td>
            <td className="p-4 text-right">
                <div className="flex justify-end gap-3">
                    <button
                        disabled={processing || isProtected}
                        onClick={() => patch(route('admin.users.update', user.id), { preserveScroll: true })}
                        className="text-[#682738] hover:underline disabled:text-gray-400 disabled:no-underline"
                    >
                        Save
                    </button>
                    <button
                        disabled={!canRemove}
                        onClick={remove}
                        className="text-red-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                    >
                        Remove
                    </button>
                </div>
            </td>
        </tr>
    );
}
