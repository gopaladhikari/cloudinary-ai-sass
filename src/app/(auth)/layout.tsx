export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="container mx-auto mt-12 grid place-content-center">
        {children}
      </section>
    </main>
  );
}
