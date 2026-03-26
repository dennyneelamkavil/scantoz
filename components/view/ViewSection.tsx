type ViewSectionProps = {
  title?: string;
  children: React.ReactNode;
};

export default function ViewSection({ title, children }: ViewSectionProps) {
  return (
    <div>
      {title && <p className="text-md text-gray-500 mb-2">{title}</p>}
      {children}
    </div>
  );
}
