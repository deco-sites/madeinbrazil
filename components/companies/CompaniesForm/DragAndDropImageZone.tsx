// deno-lint-ignore-file no-explicit-any
import { useState } from "preact/hooks";

interface Props {
  onChange: (event: any) => void;
}

const DragAndDropImageZone = ({ onChange }: Props) => {
  const [image, setImage] = useState<string | null>(null);

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (validateImage(file)) {
      onChange(event);
      displayImage(file);
    }
  };

  const handleInputChange = (event: any) => {
    const file = event.target.files[0];
    if (validateImage(file)) {
      onChange(event);
      displayImage(file);
    }
  };

  const validateImage = (file: File): boolean => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert("Please select an image smaller than 100MB.");
      return false;
    }
    return true;
  };

  const displayImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader?.result && typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
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
        {image
          ? (
            <>
              <img
                src={image}
                alt="Uploaded"
                class="mx-auto max-h-full max-w-full"
              />
              <div class="absolute h-full top-0 right-0 flex flex-col gap-[18px] justify-center items-center py-2 mr-2">
                <button class="font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline hover:bg-gray-opaque transition-all ease-in-out">
                  <img src="/edit.svg" alt="Edit" />
                </button>
                <button
                  onClick={removeImage}
                  class="font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline
                  hover:bg-gray-opaque transition-all ease-in-out"
                >
                  <img src="/trash.svg" alt="Delete" />
                </button>
              </div>
            </>
          )
          : (
            <>
              <p class="font-montserrat font-medium text-secondary text-xs">
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
  );
};

export default DragAndDropImageZone;
