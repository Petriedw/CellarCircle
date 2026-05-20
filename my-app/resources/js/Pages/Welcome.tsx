import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEvent } from 'react';

type Article = {
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    readTime?: string;
    issue?: string;
    accent: string;
    hero_image_url?: string | null;
    approved_at?: string | null;
};

type Feature = {
    eyebrow: string;
    title: string;
    copy: string;
};

const features: Feature[] = [
    {
        eyebrow: '01 / Editorial',
        title: 'Long-form stories, not noisy feeds',
        copy: 'Immersive articles, sharp summaries, and calm browsing for readers who want considered writing over disposable posts.',
    },
    {
        eyebrow: '02 / Access',
        title: 'Luxury through restraint',
        copy: 'A private editor circle keeps submissions focused, reviewed, and ready for a public audience.',
    },
    {
        eyebrow: '03 / Publishing',
        title: 'Reviewed before release',
        copy: 'Every article is submitted with context, imagery, and editorial notes before it is approved for the public journal.',
    },
];

const regions = ['Stellenbosch', 'Burgundy', 'Tuscany', 'Napa Valley', 'Douro', 'Marlborough'];

type PublicPost = {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    hero_image_url: string | null;
    approved_at: string | null;
};

export default function Welcome({ auth, posts = [] }: PageProps<{ posts: PublicPost[] }>) {
    const subscribeForm = useForm({ email: '' });
    const accessForm = useForm({ name: '', email: '', reason: '' });
    const displayArticles: Article[] = posts.map((post, index) => ({
        ...post,
        accent: ['from-rose-200/80 via-stone-100 to-amber-100', 'from-neutral-200 via-zinc-100 to-stone-300', 'from-slate-200 via-stone-100 to-emerald-100'][index % 3],
    }));

    const subscribe = (event: FormEvent) => {
        event.preventDefault();
        subscribeForm.post(route('subscribers.store'), {
            preserveScroll: true,
            onSuccess: () => subscribeForm.reset(),
        });
    };

    const requestAccess = (event: FormEvent) => {
        event.preventDefault();
        accessForm.post(route('access-requests.store'), {
            preserveScroll: true,
            onSuccess: () => accessForm.reset(),
        });
    };

    return (
        <>
            <Head title="Cellar Circle Journal" />
            <main className="min-h-screen overflow-hidden bg-[#f8f4ec] text-[#201713] selection:bg-[#682738] selection:text-[#fff8ec]">
                <div className="pointer-events-none fixed inset-0 z-0">
                    <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#7b2337]/10 blur-3xl animate-float-slow" />
                    <div className="absolute right-[-10rem] top-1/3 h-[32rem] w-[32rem] rounded-full bg-[#c7a56d]/20 blur-3xl animate-float-reverse" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(32,23,19,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(32,23,19,0.045)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />
                </div>

                <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
                    <a href="#" className="group flex items-center gap-3" aria-label="Cellar Circle Journal home">
                        <span className="grid h-11 w-11 place-items-center rounded-full border border-[#201713]/15 bg-white/50 shadow-[0_12px_40px_rgba(32,23,19,0.08)] backdrop-blur">
                            <span className="h-4 w-4 rounded-full bg-[#682738] shadow-[0_0_0_7px_rgba(104,39,56,0.10)] transition-transform duration-500 group-hover:scale-110" />
                        </span>
                        <span>
                            <span className="block font-serif text-xl tracking-tight">Cellar Circle</span>
                            <span className="block text-[0.62rem] uppercase tracking-[0.34em] text-[#77685e]">Journal</span>
                        </span>
                    </a>

                    <nav className="hidden items-center gap-8 rounded-full border border-[#201713]/10 bg-white/45 px-6 py-3 text-sm text-[#5e514a] shadow-[0_18px_60px_rgba(32,23,19,0.07)] backdrop-blur-xl md:flex">
                        <a className="transition hover:text-[#201713]" href="#features">Editorial</a>
                        <a className="transition hover:text-[#201713]" href="#journal">Journal</a>
                        <a className="transition hover:text-[#201713]" href="#regions">Regions</a>
                        <a className="transition hover:text-[#201713]" href="#subscribe">Subscribe</a>
                    </nav>

                    <div className="flex items-center gap-3 text-sm">
                        {auth.user ? (
                            <Link className="rounded-full border border-[#201713]/10 bg-[#201713] px-5 py-3 text-[#fff8ec] transition duration-300 hover:-translate-y-0.5 hover:shadow-xl" href={route('dashboard')}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link className="hidden text-[#5e514a] transition hover:text-[#201713] sm:inline" href={route('login')}>
                                    Login
                                </Link>
                                <a className="rounded-full border border-[#201713]/10 bg-[#201713] px-5 py-3 text-[#fff8ec] transition duration-300 hover:-translate-y-0.5 hover:shadow-xl" href="#access">
                                    Ask for access
                                </a>
                            </>
                        )}
                    </div>
                </header>

                <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-20">
                    <div className="animate-rise">
                        <p className="mb-7 inline-flex rounded-full border border-[#682738]/15 bg-white/50 px-4 py-2 text-xs uppercase tracking-[0.34em] text-[#682738] shadow-sm backdrop-blur">
                            Independent wine culture • adults only
                        </p>
                        <h1 className="max-w-5xl font-serif text-[clamp(4.2rem,11vw,10.5rem)] font-medium leading-[0.82] tracking-[-0.075em] text-[#201713]">
                            Stories poured with patience.
                        </h1>
                        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#65584f] md:text-xl">
                            An independent wine journal for vineyard stories, cellar architecture, regional travel, and the slower side of wine culture.
                        </p>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Link href={route('journal.index')} className="group inline-flex items-center justify-center rounded-full bg-[#682738] px-7 py-4 text-sm font-medium text-[#fff8ec] shadow-[0_22px_55px_rgba(104,39,56,0.25)] transition duration-500 hover:-translate-y-1 hover:bg-[#4f1d2b]">
                                Read the journal
                                <span className="ml-3 transition-transform duration-500 group-hover:translate-x-1">→</span>
                            </Link>
                            <a href="#access" className="inline-flex items-center justify-center rounded-full border border-[#201713]/15 bg-white/50 px-7 py-4 text-sm font-medium text-[#201713] backdrop-blur transition duration-500 hover:-translate-y-1 hover:bg-white">
                                Become an editor
                            </a>
                        </div>
                    </div>

                    <div className="relative min-h-[540px] animate-rise-delayed lg:min-h-[660px]">
                        <div className="absolute left-6 top-0 h-[76%] w-[68%] overflow-hidden rounded-[2.5rem] border border-white/70 bg-[#2b1d19] p-4 shadow-[0_50px_120px_rgba(32,23,19,0.22)] sm:left-14">
                            <div className="h-full rounded-[2rem] bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.34),transparent_20%),linear-gradient(150deg,#2a1716_0%,#6f2638_42%,#c5a26a_100%)]" />
                        </div>
                        <div className="absolute bottom-6 right-0 w-[82%] rounded-[2.25rem] border border-[#201713]/10 bg-white/70 p-5 shadow-[0_35px_90px_rgba(32,23,19,0.16)] backdrop-blur-xl transition duration-700 hover:-translate-y-2 sm:w-[70%]">
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.32em] text-[#8b735d]">Cover story</p>
                                    <h2 className="mt-4 font-serif text-4xl leading-none tracking-tight">The architecture of patience</h2>
                                </div>
                                <span className="rounded-full border border-[#201713]/10 px-3 py-2 text-xs text-[#6b5b52]">2026</span>
                            </div>
                            <p className="mt-5 text-sm leading-7 text-[#6b5b52]">Measured essays on producers, places, design, and the culture around thoughtful wine appreciation.</p>
                            <div className="mt-6 h-px bg-[#201713]/10" />
                            <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[#8b735d]">
                                <span>Vineyard profile</span>
                                <span>08 min</span>
                            </div>
                        </div>
                        <div className="absolute right-10 top-16 hidden rounded-full border border-white/60 bg-white/50 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[#682738] shadow-lg backdrop-blur md:block animate-float-slow">
                            Slow reading
                        </div>
                    </div>
                </section>

                <section id="features" className="relative z-10 border-y border-[#201713]/10 bg-[#201713] px-6 py-16 text-[#fff8ec] lg:px-10">
                    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
                        {features.map((feature) => (
                            <article key={feature.title} className="group rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 transition duration-500 hover:-translate-y-2 hover:bg-white/[0.07]">
                                <p className="text-xs uppercase tracking-[0.3em] text-[#c7a56d]">{feature.eyebrow}</p>
                                <h3 className="mt-8 font-serif text-3xl leading-tight tracking-tight">{feature.title}</h3>
                                <p className="mt-5 leading-7 text-[#d4c8bd]/80">{feature.copy}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="journal" className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
                    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs uppercase tracking-[0.34em] text-[#682738]">Latest journal</p>
                            <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.045em] md:text-7xl">Fresh stories, open to every reader.</h2>
                        </div>
                        <p className="max-w-sm leading-7 text-[#65584f]">
                            A curated selection of essays from trusted contributors, edited before publication and available to all readers.
                        </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3">
                        {displayArticles.map((article, index) => (
                            <article key={article.title} className={`group rounded-[2.25rem] border border-[#201713]/10 bg-white/55 p-4 shadow-[0_24px_80px_rgba(32,23,19,0.07)] backdrop-blur transition duration-700 hover:-translate-y-3 hover:bg-white ${index === 1 ? 'lg:translate-y-12' : ''}`}>
                                <div className={`h-72 overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${article.accent} p-5 transition duration-700 group-hover:scale-[0.985]`}>
                                    {article.hero_image_url ? (
                                        <img className="h-full w-full rounded-[1.4rem] object-cover" src={article.hero_image_url} alt="" />
                                    ) : (
                                    <div className="flex h-full flex-col justify-between rounded-[1.4rem] border border-white/60 bg-white/25 p-5 backdrop-blur-sm">
                                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[#6b5b52]">
                                            <span>{article.issue ?? 'Published'}</span>
                                            <span>{article.readTime ?? 'Journal'}</span>
                                        </div>
                                        <div className="h-28 rounded-full bg-[radial-gradient(circle,rgba(104,39,56,0.34),rgba(104,39,56,0.06)_45%,transparent_70%)] blur-sm" />
                                    </div>
                                    )}
                                </div>
                                <div className="px-3 pb-4 pt-7">
                                    <p className="text-xs uppercase tracking-[0.28em] text-[#8b735d]">{article.category}</p>
                                    <h3 className="mt-4 font-serif text-3xl leading-none tracking-tight text-[#201713]">{article.title}</h3>
                                    <p className="mt-5 leading-7 text-[#65584f]">{article.excerpt}</p>
                                    <Link href={route('journal.show', article.slug)} className="mt-7 inline-flex items-center text-sm font-medium text-[#682738] transition group-hover:translate-x-1">
                                        Read article <span className="ml-2">→</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                        {displayArticles.length === 0 && (
                            <div className="rounded-[2.25rem] border border-[#201713]/10 bg-white/65 p-10 shadow-[0_24px_80px_rgba(32,23,19,0.07)] backdrop-blur lg:col-span-3">
                                <p className="text-xs uppercase tracking-[0.28em] text-[#8b735d]">Opening soon</p>
                                <h3 className="mt-4 font-serif text-4xl leading-none tracking-tight text-[#201713]">The first Cellar Circle stories are being prepared.</h3>
                                <p className="mt-5 max-w-2xl leading-7 text-[#65584f]">Subscribe for new essays as they are published, or request contributor access if you would like to write for the journal.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section id="regions" className="relative z-10 overflow-hidden border-y border-[#201713]/10 bg-[#eee5d7] py-10">
                    <div className="marquee flex whitespace-nowrap text-[clamp(3rem,8vw,8rem)] font-serif tracking-[-0.06em] text-[#201713]/80">
                        {[...regions, ...regions].map((region, index) => (
                            <span className="mx-8" key={`${region}-${index}`}>{region}</span>
                        ))}
                    </div>
                </section>

                <section id="access" className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-32">
                    <div>
                        <p className="text-xs uppercase tracking-[0.34em] text-[#682738]">Editor access</p>
                        <h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.045em] md:text-7xl">Ask for a seat at the editorial table.</h2>
                    </div>
                    <form className="rounded-[2.5rem] border border-[#201713]/10 bg-white/65 p-6 shadow-[0_40px_100px_rgba(32,23,19,0.10)] backdrop-blur-xl md:p-10" onSubmit={requestAccess}>
                        <p className="max-w-xl text-lg leading-8 text-[#65584f]">Public registration is closed. Tell us who you are and what you want to write; accepted contributors receive a private login.</p>
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <input className="min-h-14 rounded-full border-[#201713]/10 bg-[#f8f4ec] px-6 text-[#201713] placeholder:text-[#8b7a70] focus:border-[#682738] focus:ring-[#682738]" placeholder="Name" value={accessForm.data.name} onChange={(event) => accessForm.setData('name', event.target.value)} />
                            <input className="min-h-14 rounded-full border-[#201713]/10 bg-[#f8f4ec] px-6 text-[#201713] placeholder:text-[#8b7a70] focus:border-[#682738] focus:ring-[#682738]" placeholder="Email address" type="email" value={accessForm.data.email} onChange={(event) => accessForm.setData('email', event.target.value)} />
                        </div>
                        <textarea className="mt-3 min-h-32 w-full rounded-[1.5rem] border-[#201713]/10 bg-[#f8f4ec] px-6 py-4 text-[#201713] placeholder:text-[#8b7a70] focus:border-[#682738] focus:ring-[#682738]" placeholder="What kind of wine stories would you contribute?" value={accessForm.data.reason} onChange={(event) => accessForm.setData('reason', event.target.value)} />
                        <button className="mt-4 min-h-14 rounded-full bg-[#201713] px-7 text-sm font-medium text-[#fff8ec] transition duration-500 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50" disabled={accessForm.processing} type="submit">Request editor access</button>
                        {accessForm.recentlySuccessful && <p className="mt-4 text-sm text-[#682738]">Access request received.</p>}
                    </form>
                </section>

                <section id="subscribe" className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-32">
                    <div>
                        <p className="text-xs uppercase tracking-[0.34em] text-[#682738]">Private list</p>
                        <h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.045em] md:text-7xl">A slower inbox for better stories.</h2>
                    </div>
                    <div className="rounded-[2.5rem] border border-[#201713]/10 bg-white/65 p-6 shadow-[0_40px_100px_rgba(32,23,19,0.10)] backdrop-blur-xl md:p-10">
                        <p className="max-w-xl text-lg leading-8 text-[#65584f]">
                            Monthly essays on vineyard travel, design, collecting culture, and responsible appreciation — no loud marketing, no clutter, no rush.
                        </p>
                        <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={subscribe}>
                            <input
                                aria-label="Email address"
                                className="min-h-14 flex-1 rounded-full border-[#201713]/10 bg-[#f8f4ec] px-6 text-[#201713] placeholder:text-[#8b7a70] focus:border-[#682738] focus:ring-[#682738]"
                                placeholder="Email address"
                                type="email"
                                value={subscribeForm.data.email}
                                onChange={(event) => subscribeForm.setData('email', event.target.value)}
                            />
                            <button className="min-h-14 rounded-full bg-[#201713] px-7 text-sm font-medium text-[#fff8ec] transition duration-500 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50" disabled={subscribeForm.processing} type="submit">
                                Notify me
                            </button>
                        </form>
                        {subscribeForm.recentlySuccessful && <p className="mt-4 text-sm text-[#682738]">You are on the notification list.</p>}
                        <p className="mt-5 text-xs leading-6 text-[#8b7a70]">
                            Content is written for adults. Please enjoy wine culture responsibly and follow the laws in your country.
                        </p>
                    </div>
                </section>

                <footer className="relative z-10 border-t border-[#201713]/10 px-6 py-8 lg:px-10">
                    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#6b5b52] md:flex-row md:items-center">
                        <p>© 2026 Cellar Circle Journal.</p>
                        <p>Independent • Curated • Responsible</p>
                    </div>
                </footer>
            </main>
        </>
    );
}
