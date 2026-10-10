import Image from "next/image";

interface AuthBrandProps {
  className?: string;
}

const AuthBrand = ({ className = "" }: AuthBrandProps) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <Image
      src="/icons/brand-logo.svg"
      alt=""
      width={34}
      height={34}
      aria-hidden="true"
    />
    <span className="text-2xl font-bold tracking-tight">Bringam</span>
  </div>
);

export default AuthBrand;
