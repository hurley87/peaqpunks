'use client';
import { usePunkImage } from '@/hooks/usePunkImage';

const Token = ({ tokenId }: { tokenId: number }) => {
  const punkImage = usePunkImage(tokenId);

  return (
    <img
      className="w-40 h-40 bg-primary"
      src={`data:image/svg+xml;utf8,${encodeURIComponent(
        punkImage.split(',')[1]
      )}`}
    />
  );
};

export default Token;
