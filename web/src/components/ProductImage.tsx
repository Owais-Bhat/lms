import Image from "next/image";
import CakeIllustration from "@/components/CakeIllustration";
import type { CakeVariant } from "@/components/CakeIllustration";

export function ProductImage({
  image,
  illustration,
  alt,
  className,
  sizes = "(max-width: 640px) 50vw, 300px",
}: {
  image?: string;
  illustration: CakeVariant;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (image) {
    return (
      <div className={`relative overflow-hidden ${className ?? ""}`}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }
  return <CakeIllustration variant={illustration} className={className} />;
}
