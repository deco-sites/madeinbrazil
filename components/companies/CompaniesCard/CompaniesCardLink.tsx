interface Props {
  href: string;
  imgSrc: string;
  alt: string;
}

export default function CompaniesCardLink(
  { href, imgSrc, alt }: Props,
) {
  return (
    <a
      onClick={(e) => e.stopPropagation()}
      href={href}
      className="flex items-center justify-center w-14 h-12 bg-transparent hover:bg-gray-opaque-light rounded-full transition ease-in-out"
    >
      <img src={imgSrc} alt={alt} />
    </a>
  );
}
