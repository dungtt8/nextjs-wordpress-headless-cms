import { ImageSquare } from "@phosphor-icons/react/ssr";
import Image from "next/image";

interface UploadReadyImageSource {
    src: string;
    alt: string;
}

interface UploadReadyImageProps {
    image?: UploadReadyImageSource;
    title: string;
    subtitle?: string;
    className?: string;
    ratioClassName?: string;
}

export function UploadReadyImage({
    image,
    title,
    subtitle,
    className = "",
    ratioClassName = "aspect-[16/10]",
}: UploadReadyImageProps) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-violet-200 ${ratioClassName} ${className}`}>
            {image ? (
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                />
            ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,181,253,0.45),transparent_45%),linear-gradient(180deg,#ffffff,#f6f2ff)]" />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white">
                <div>
                    <p className="text-sm font-semibold tracking-wide">{title}</p>
                    {subtitle ? <p className="mt-1 text-xs text-white/85">{subtitle}</p> : null}
                </div>
                <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                    <ImageSquare weight="thin" className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}
