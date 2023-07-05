interface CompaniesCardTagProps {
  tagParent?: string;
  tag: string;
}

export default function CompaniesCardTag(
  { tag }: CompaniesCardTagProps,
) {
  return (
    <span className="text-primary font-montserrat font-medium text-[14px] px-4 py-1 bg-neutral bg-opacity-20 rounded-[40px] border border-primary-opaque  transition ease-in-out">
      {tag}
    </span>
  );
}
