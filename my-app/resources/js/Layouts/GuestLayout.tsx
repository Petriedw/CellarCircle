import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <main className="flex min-h-screen bg-[#f8f4ec] text-[#201713]">
            <section className="hidden min-h-screen w-[44%] border-r border-[#201713]/10 bg-[#201713] px-10 py-12 text-[#fff8ec] lg:flex lg:flex-col lg:justify-between">
                <Link href="/" className="inline-flex" aria-label="Cellar Circle Journal home">
                    <ApplicationLogo className="h-32 w-auto shadow-[0_20px_60px_rgba(0,0,0,0.25)]" />
                </Link>

                <div className="max-w-xl">
                    <p className="text-xs uppercase tracking-[0.34em] text-[#d8bf8f]">Private editorial access</p>
                    <h1 className="mt-6 font-serif text-6xl leading-none">Write from the cellar table.</h1>
                    <p className="mt-6 max-w-md leading-8 text-[#eadfce]/80">
                        A quiet publishing room for approved contributors, reviewers, and editors shaping the journal.
                    </p>
                </div>

                <p className="text-xs uppercase tracking-[0.28em] text-[#d8bf8f]/80">Independent / Curated / Responsible</p>
            </section>

            <section className="flex min-h-screen flex-1 flex-col px-6 py-8 sm:px-10">
                <div className="flex items-center justify-between lg:justify-end">
                    <Link href="/" className="inline-flex lg:hidden" aria-label="Cellar Circle Journal home">
                        <ApplicationLogo className="h-14 w-auto shadow-sm" />
                    </Link>
                    <Link href="/" className="text-sm text-[#682738] transition hover:text-[#201713]">
                        Journal
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center py-12">
                    <div className="w-full max-w-md rounded-lg border border-[#201713]/10 bg-white/70 p-6 shadow-[0_24px_80px_rgba(32,23,19,0.10)] backdrop-blur sm:p-8">
                        {children}
                    </div>
                </div>
            </section>
        </main>
    );
}
