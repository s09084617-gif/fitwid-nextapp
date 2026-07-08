function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function Welcome({ name }: { name: string }) {
  return (
    <div>
      <p className="text-gold tracking-[0.2em] text-xs font-semibold uppercase mb-1">
        FitWid Dashboard
      </p>
      <h1 className="font-display text-3xl">
        {greeting()}, {name}
      </h1>
    </div>
  );
}
