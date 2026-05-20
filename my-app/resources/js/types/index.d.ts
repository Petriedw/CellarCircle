export interface User {
    id: number;
    name: string;
    email: string;
    role: 'head_admin' | 'admin' | 'editor';
    email_verified_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
