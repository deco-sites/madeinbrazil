// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from "preact/hooks";

interface Props {
  name: string;
  label: string;
  onChange: (file: File) => void;
}

export default function DragAndDropImageZone({ name, label, onChange }: Props) {
  const [image, setImage] = useState<string | null>(null);

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (validateImage(file)) {
      displayImage(file);
      onChange(file);
    }
  };

  const handleInputChange = (event: any) => {
    const file = event.target.files[0];
    if (validateImage(file)) {
      displayImage(file);
      onChange(file);
    }
  };

  const validateImage = (file: File): boolean => {
    const maxSize = 34 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Please select an image smaller than 34MB.");
      return false;
    }
    return true;
  };

  const displayImage = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader?.result && typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <>
      <div class="flex justify-between items-center mb-3">
        <label
          class="block font-montserrat text-black text-sm font-medium"
          for={name}
        >
          {label}:
        </label>

        {image && (
          <button
            onClick={removeImage}
            class="flex justify-center items-center gap-2 font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline hover:bg-gray-opaque transition-all ease-in-out"
          >
            <img
              src="/edit-dark.svg"
              alt="Edit"
            />
          </button>
        )}
      </div>
      <div
        class={`w-full h-[130px] p-1 rounded-lg flex justify-center items-center ${
          image ? "bg-primary" : "bg-gray-opaque"
        }`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <div
          class={`relative w-full h-full rounded-lg ${
            image ? "" : "border-2 border-dashed border-gray-opaque-dark"
          }  flex justify-center items-center`}
        >
          {image?.length
            ? (
              <img
                src={image}
                alt="Uploaded"
                class="mx-auto max-h-full max-w-full"
              />
            )
            : (
              <>
                <p class="font-montserrat font-medium text-secondary text-xs px-4">
                  {"Drag and drop a file here (jpeg or png) or click to upload"}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  class="hidden"
                  id={name + "Input"}
                />
                <label
                  type="button"
                  class="absolute top-0 left-0 w-full h-full cursor-pointer"
                  for={name + "Input"}
                />
              </>
            )}
        </div>
      </div>
    </>
  );
}
