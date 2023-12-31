// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from "preact/hooks";

import { useFormModal } from "$store/sdk/useFormModal.ts";
import { useToast } from "$store/sdk/useToast.ts";

import Modal from "../../ui/Modal.tsx";
import FormField from "./CompaniesFormField.tsx";

import isMobile from "../../helpers/isMobile.ts";

interface Company {
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

export interface Checkbox {
  name: string;
  label: string;
}

export interface Props {
  isVisibleTurnItOffAfterTesting?: boolean;
  title?: string;
  subtitle?: string;
  employees: string[];
  stages: string[];
  capital: string[];
  /** @description: Please insert a unique name, so the checkboxes can be validated properly */
  checkboxes?: Array<Checkbox>;
}

export default function CompaniesNominateForm({
  isVisibleTurnItOffAfterTesting = false,
  title = "Nominate",
  subtitle =
    "Nominate Your Favorite Brazilian Tech Company for the Tech Made in Brazil List",
  employees,
  stages,
  capital,
  checkboxes = [],
}: Props) {
  const { displayFormModal } = useFormModal();
  const { displayToast, toastContent } = useToast();

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

  const [checkboxesState, setCheckboxesState] = useState<
    Record<string, boolean>
  >(checkboxes.reduce((acc, checkbox) => {
    acc[checkbox.name] = false;
    return acc;
  }, {} as Record<string, boolean>));

  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof Company, string>>>(
    {},
  );

  useEffect(() => {
    if (success) {
      toastContent.value = "Company successfully nominated!";
      displayToast.value = true;
      displayFormModal.value = false;
    }
  }, [success]);

  const sendNewCompanyRequest = async (company: Company) => {
    const response = await fetch("/api/companies", {
      method: "POST",
      body: JSON.stringify(company),
    });

    const data = await response.json();

    if (data.status < 400) {
      setSuccess(true);
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDropdownSelect = (option: string, name: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: option,
    }));
  };

  const handleCheckboxChange = (event: any, name: string) => {
    const { checked } = event.target;

    setCheckboxesState((prevState) => ({
      ...prevState,
      [name]: checked,
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

    // check if checkboxes are selected
    Object.entries(checkboxesState).forEach(([checkboxName, checkboxValue]) => {
      if (!checkboxValue) {
        newErrors[checkboxName] = "This field is required";
      }
    });

    setErrors(newErrors);

    return Object.values(newErrors).length === 0;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (validateForm()) {
      sendNewCompanyRequest(formState);
    }
  };

  return (
    <Modal
      open={isVisibleTurnItOffAfterTesting || displayFormModal.value}
      title={title}
      subtitle={subtitle}
      mode={isMobile() ? "sidebar-bottom" : "center"}
      className="p-0 w-full h-[95%] top-auto md:top-0 md:h-full overflow-hidden max-w-none max-h-none md:max-w-[792px] 
      md:max-h-[628px] rounded-[40px] max-md:rounded-b-none shadow-[0_0_12_0_rgba(0,0,0,0.2)] scrollbar-light"
      onClose={() => {
        displayFormModal.value = false;
      }}
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
        <div class="flex flex-col md:flex-row justify-between items-center md:gap-6">
          <FormField
            label="Employees"
            type="select"
            name="employees"
            value={formState.employees}
            values={employees}
            errors={errors}
            onChange={handleDropdownSelect}
          />
          <FormField
            label="Company Stage"
            type="select"
            name="companyStage"
            value={formState.companyStage}
            values={stages}
            errors={errors}
            onChange={handleDropdownSelect}
          />
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center md:gap-6">
          <FormField
            label="Capital"
            type="select"
            name="capital"
            value={formState.capital}
            values={capital}
            errors={errors}
            onChange={handleDropdownSelect}
          />
          <FormField
            label="Segment"
            type="text"
            name="segment"
            value={formState.segment || ""}
            errors={errors}
            onChange={handleChange}
          />
        </div>
        <FormField
          label="Website"
          type="text"
          name="website"
          value={formState.website || ""}
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
          label="Email"
          type="text"
          name="email"
          value={formState.email || ""}
          errors={errors}
          onChange={handleChange}
        />
        {checkboxes?.map((checkbox) => (
          <FormField
            label={checkbox.label}
            type="checkbox"
            name={checkbox.name}
            value={checkboxesState[checkbox.name]}
            errors={errors}
            onChange={handleCheckboxChange}
          />
        ))}
        <div class="flex justify-end items-center gap-6 mt-6">
          <button
            type="button"
            class="text-primary font-montserrat font-medium text-sm px-6 py-4 rounded-[40px] transition ease-in-out w-fit hover:bg-gray-opaque-light"
            onClick={() => {
              displayFormModal.value = false;
            }}
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
