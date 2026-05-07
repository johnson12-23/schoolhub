function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.2em] text-brand-green">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base text-slate-600">{description}</p> : null}
    </div>
  );
}

export default SectionHeading;

