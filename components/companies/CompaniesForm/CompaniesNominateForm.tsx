// deno-lint-ignore-file no-explicit-any
import { useState } from "preact/hooks";

import Modal from "../../ui/Modal.tsx";
import FormField from "./CompaniesFormField.tsx";

import isMobile from "../../helpers/isMobile.ts";

export interface Company {
  id?: string;
  name: string;
  about: string;
  logo: string;
  banner: string;
  website: string | null;
  email: string | null;
  instagram: string | null;
  employees: string;
  capital: string;
  segment: string;
  companyStage: string;
  [key: string]: string | number | null | undefined;
}

interface NewCompanyFormProps {
  open: boolean;
  onClose: () => Promise<void> | void;
}

export default function CompaniesNominateForm({
  open,
  onClose,
}: NewCompanyFormProps) {
  const [formState, setFormState] = useState<Company>({
    name: "",
    about: "",
    logo: "",
    banner: "",
    website: null,
    email: null,
    instagram: null,
    employees: "",
    capital: "",
    segment: "",
    companyStage: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Company, string>>>(
    {},
  );

  const sendNewCompanyRequest = async (company: Company) => {
    const response = await fetch("/api/companies", {
      method: "POST",
      body: JSON.stringify(company),
    });

    const data = await response.json();

    console.log("data", data);
  };

  const handleChange = (event: any) => {
    const { name, value, type, checked } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogoChange = (file: File) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader?.result && typeof reader.result === "string") {
        const fileBase64 = reader.result;

        setFormState((prevState) => ({
          ...prevState,
          logo: fileBase64,
        }));
      }
    };
  };

  const handleBannerChange = (file: File) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (reader?.result && typeof reader.result === "string") {
        const fileBase64 = reader.result;

        setFormState((prevState) => ({
          ...prevState,
          banner: fileBase64,
        }));
      }
    };
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    Object.entries(formState).forEach(([fieldName, fieldValue]) => {
      if (!fieldValue) {
        newErrors[fieldName] = "This field is required";
      }
    });

    setErrors(newErrors);

    console.log("Object.keys(newErrors)", Object.keys(newErrors));

    console.log("Object.keys(newErrors).length", Object.keys(newErrors).length);

    return Object.values(newErrors).length === 0;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (validateForm()) {
      console.log("formState", formState);

      sendNewCompanyRequest(formState);
    }
  };

  return (
    <Modal
      open={open}
      title="Nominate"
      subtitle="Nominate Your Favorite Brazilian Tech Company for the Tech Made in Brazil List"
      mode={isMobile() ? "sidebar-bottom" : "center"}
      className="w-full h-[95%] top-auto md:top-0 md:h-full overflow-hidden max-w-none max-h-none md:max-w-[792px] 
      md:max-h-[628px] rounded-[40px] shadow-[0_0_12_0_rgba(0,0,0,0.2)] scrollbar-light px-4 
      md:pr-[9px] md:pl-[57px] pt-16 pb-8"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} class="w-full mx-auto pb-10">
        <FormField
          label="Logo"
          type="file"
          name="logo"
          value=""
          errors={errors}
          onChange={handleLogoChange}
        />
        <FormField
          label="Name"
          type="text"
          name="name"
          value={formState.name}
          errors={errors}
          onChange={handleChange}
        />
        <FormField
          label="About"
          type="textarea"
          name="about"
          value={formState.about}
          errors={errors}
          onChange={handleChange}
        />
        <FormField
          label="Banner"
          type="file"
          name="banner"
          value=""
          errors={errors}
          onChange={handleBannerChange}
        />
        <FormField
          label="Website"
          type="text"
          name="website"
          value={formState.website || ""}
          errors={errors}
          onChange={handleChange}
        />
        <FormField
          label="Email"
          type="text"
          name="email"
          value={formState.email || ""}
          errors={errors}
          onChange={handleChange}
        />
        <FormField
          label="Instagram"
          type="text"
          name="instagram"
          value={formState.instagram || ""}
          errors={errors}
          onChange={handleChange}
        />
        <FormField
          label="Employees"
          type="text"
          name="employees"
          value={formState.employees}
          errors={errors}
          onChange={handleChange}
        />
        <FormField
          label="Capital"
          type="text"
          name="capital"
          value={formState.capital}
          errors={errors}
          onChange={handleChange}
        />
        <FormField
          label="Segment"
          type="text"
          name="segment"
          value={formState.segment}
          errors={errors}
          onChange={handleChange}
        />
        <FormField
          label="Company Stage"
          type="text"
          name="companyStage"
          value={formState.companyStage}
          errors={errors}
          onChange={handleChange}
        />
        <div class="flex justify-end items-center gap-6 mt-6">
          <button
            type="button"
            class="text-primary font-montserrat font-medium text-sm px-6 py-4 rounded-[40px] transition ease-in-out w-fit hover:bg-gray-opaque-light"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-primary text-primary-content font-medium text-sm px-6 py-4 rounded-[40px] hover:bg-opacity-80 shadow-md transition ease-in-out w-fit"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </Modal>
  );
}
