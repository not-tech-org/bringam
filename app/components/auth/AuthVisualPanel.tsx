import Image from "next/image";

interface AuthVisualPanelProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
}

const AuthVisualPanel = ({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
}: AuthVisualPanelProps) => (
  <aside className="relative hidden h-full min-h-0 overflow-hidden bg-[#27322f] lg:block">
    <Image
      src={imageSrc}
      alt={imageAlt}
      fill
      priority
      sizes="40vw"
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />
    <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-12">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
        {eyebrow}
      </p>
      <h2 className="max-w-md text-3xl font-bold leading-tight xl:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-md text-sm leading-6 text-white/85 xl:text-base">
        {description}
      </p>
    </div>
  </aside>
);

export default AuthVisualPanel;
