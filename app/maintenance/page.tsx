import Link from "next/link";

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#111111] px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#e81818_0,transparent_35%),radial-gradient(circle_at_bottom_right,#f2b600_0,transparent_30%)] opacity-25" />

      <section className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f2b600]">
          UNMUTE2K26
        </p>

        <h1 className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] md:text-8xl">
          Working
          <span className="block text-[#e81818]">On Updates</span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-base font-semibold leading-8 text-white/70 md:text-lg">
          The website is currently being edited. Please check back soon.
        </p>

        <Link
          href="/admin"
          className="mt-10 inline-flex rounded-full bg-[#e81818] px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:scale-105"
        >
          Admin Panel
        </Link>
      </section>
    </main>
  );
}