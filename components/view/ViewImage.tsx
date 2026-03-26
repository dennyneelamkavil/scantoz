import { useState } from "react";
import Image from "next/image";
import MediaPreviewModal from "@/components/ui/media/MediaPreviewModal";

type ViewImageProps = {
  label: string;
  src: string;
  alt: string;
  caption?: string;
  size?: number;
};

export default function ViewImage({
  label,
  src,
  alt,
  caption,
  size = 120,
}: ViewImageProps) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-md text-gray-500 mb-2">{label}</p>

      <div className="grid grid-cols-[160px_1fr] gap-6 items-start">
        <button onClick={() => setPreview(src)} className="focus:outline-none">
          <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className="rounded object-cover border dark:border-gray-800"
          />
        </button>

        <div className="space-y-3">
          {alt && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Alt Text
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{alt}</p>
            </div>
          )}

          {caption && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Caption
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {caption}
              </p>
            </div>
          )}
        </div>
      </div>

      <MediaPreviewModal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        type="image"
        src={preview ?? ""}
      />
    </div>
  );
}
