export function VideoDisplay({ s3VideoKey }: { s3VideoKey?: string | null }) {
  if (!s3VideoKey) return null;
  
  const url = `https://portafoliovideo.s3.us-east-1.amazonaws.com/${s3VideoKey}`;
  
  return (
    <video controls className="w-full rounded-lg">
      <source src={url} type="video/mp4" />
    </video>
  );
}