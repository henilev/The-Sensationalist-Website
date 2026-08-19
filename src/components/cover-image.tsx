import Image from "next/image";

export function CoverImage({
  src,
  alt,
  aspect = "aspect-[16/9]",
}: {
  src: string | null;
  alt: string;
  aspect?: string;
}) {
  if (!src) return null;
  return (
    <div className={`relative ${aspect}`}>
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
