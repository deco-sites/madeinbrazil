// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from "preact/hooks";

import isMobile from "../../helpers/isMobile.ts";

interface Props {
  onChange: (file: File) => void;
}

const DragAndDropImageZone = ({ onChange }: Props) => {
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
    event.preventDefault();
    const file = event.target.files[0];
    if (validateImage(file)) {
      displayImage(file);
      onChange(file);
    }
  };

  const validateImage = (file: File): boolean => {
    const maxSize = 1000 * 1024 * 1024;
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
              <>
                <img
                  src={image}
                  alt="Uploaded"
                  class="mx-auto max-h-full max-w-full"
                />
                {!isMobile() && (
                  <div class="md:absolute md:h-full md:top-0 md:right-0 flex md:flex-col md:gap-[18px] md:justify-center items-center py-2 md:mr-2">
                    <button class="flex gap-2 font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline hover:bg-gray-opaque transition-all ease-in-out">
                      <img
                        src="/edit.svg"
                        alt="Edit"
                      />
                    </button>
                    <button
                      onClick={removeImage}
                      class="flex gap-2 font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline
                                hover:bg-gray-opaque transition-all ease-in-out"
                    >
                      <img
                        src="/trash.svg"
                        alt="Delete"
                      />
                    </button>
                  </div>
                )}
              </>
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
                  id="uploadInput"
                />
                <label
                  type="button"
                  class="absolute top-0 left-0 w-full h-full cursor-pointer"
                  for="uploadInput"
                />
              </>
            )}
        </div>
      </div>
      {image && isMobile() && (
        <div class="flex justify-center items-center py-2">
          <button class="flex w-full justify-center items-center gap-2 font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline hover:bg-gray-opaque transition-all ease-in-out">
            <img
              src={`${isMobile() ? "/edit-dark.svg" : "/edit.svg"}`}
              alt="Edit"
            />
            {isMobile() && (
              <span class="font-montserrat font-medium text-primary text-sm">
                Edit
              </span>
            )}
          </button>
          <button
            onClick={removeImage}
            class="flex w-full justify-center items-center gap-2 font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline
                                hover:bg-gray-opaque transition-all ease-in-out"
          >
            <img
              src={`${isMobile() ? "/trash-dark.svg" : "/trash.svg"}`}
              alt="Delete"
            />
            {isMobile() && (
              <span class="font-montserrat font-medium text-primary text-sm">
                Delete
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default DragAndDropImageZone;
