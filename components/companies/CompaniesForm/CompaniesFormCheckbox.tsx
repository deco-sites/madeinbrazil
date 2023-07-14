interface Props {
  name: string;
  label: string;
  currentValue: boolean;
  // deno-lint-ignore no-explicit-any
  handleCheckbox: (event: any, name: string) => void;
}

export default function CompaniesFormCheckbox({
  name,
  label,
  currentValue,
  handleCheckbox,
}: Props) {
  return (
    <div
      key={name}
      className="flex items-center"
    >
      <input
        className={`cursor-pointer w-4 h-4 form-checkbox rounded border focus:ring-0 focus:ring-transparent border-primary-opaque hover:border-primary-opaque-dark ring-transparent checked:border-primary-opaque ${
          currentValue
            ? "text-gray-opaque hover:text-gray-opaque-dark border-primary-opaque"
            : "bg-white hover:bg-gray-opaque text-white"
        }
          `}
        type="checkbox"
        id={name}
        onChange={(e) => handleCheckbox(e, name)}
        checked={currentValue}
      />
      <label
        for={name}
        className="pl-2 text-sm font-medium font-montserrat text-primary cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}
