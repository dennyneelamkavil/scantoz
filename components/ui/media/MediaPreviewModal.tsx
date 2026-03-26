"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/modal";

type MediaPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "image" | "video";
  src: string;
};

export default function MediaPreviewModal({
  isOpen,
  onClose,
  type,
  src,
}: MediaPreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none"
    >
      <div className="relative w-full h-[80vh] flex items-center justify-center rounded-lg overflow-hidden">
        {type === "image" ? (
          <Image
            src={src}
            alt="Preview"
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority
          />
        ) : (
          <video
            src={src}
            controls
            className="w-full h-full object-contain p-2"
          />
        )}
      </div>
    </Modal>
  );
}
