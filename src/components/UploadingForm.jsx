"use client";
import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import Image from "next/image";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { colors, createOption, groupedOptions, formatGroupLabel } from "@/lib";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm, Controller } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { fetchUserId, incrementCount } from "@/lib/fetchWeatherData";
import { useAtom } from "jotai";
import { countAtom } from "@/lib/atomStore";

const UploadingForm = () => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgUpload, setImgUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [saving, setSaving] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(colors);
  const [category, setCategory] = useState({});
  const [photoUrl, setPhotoUrl] = useState("");
  const [pattern, setPattern] = useState("");
  const [value, setValue] = useState();
  const [showImage, setShowImage] = useState(false);

  const [isToggled, setIsToggled] = useState(false);
  const [count, setCount] = useAtom(countAtom);
  const toggleSwitch = () => setIsToggled(!isToggled);

  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const email = session && session.user.email;

  useEffect(() => {
    if (email && email.length > 0) {
      checkUserSubscription();
    }
  }, [email]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [uploadedImage]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      colors: [],
      category: "",
    },
  });

  // TODO fix dashboard
  const checkUserSubscription = async () => {
    const user = await fetchUserId(email);

    if (!user.isPro && user.count >= 20) {
      toast({
        title: "Upgrade to Pro",
        description: "Upgrade to pro to add more items",
        variant: "destructive",
      });
      return router.push("/dashboard");
    }
  };
  const grabImage = async (event) => {
    const imageInput = document.querySelector('input[type="file"]');
    setImgUpload(true);
    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(
      `https://api.imgbb.com/1/upload?expiration=60000&key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    const UploadedImg = data.data.url;
    setUploadedImage(UploadedImg);
    setImgUpload(false);
    setLoading(true);
    // const res = await fetch('/api/removeBg', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     file: UploadedImg,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // const result = await res.json();
    // setImage(uploadedImage);
    setLoading(false);
    const imageResponse = await fetch(uploadedImage);

    const imageBlob = await imageResponse.blob();

    const dataForm = new FormData();
    dataForm.append("file", file);
    const s3Upload = await fetch("/api/uploadAWS", {
      method: "POST",
      body: dataForm,
    });

    const s3UploadJson = await s3Upload.json();

    setPhotoUrl(s3UploadJson);
    setImage(s3UploadJson);
  };

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prevOptions) => [...prevOptions, newOption]);
      // Check if value is already an array and add the new option to it
      setValue((prevValue) => {
        // If prevValue is not an array, make it an array with the single value
        const valueArray = Array.isArray(prevValue)
          ? prevValue
          : prevValue
          ? [prevValue]
          : [];
        return [...valueArray, newOption];
      });
    }, 1000);
  };

  const handleSelectChange = (newValue) => {
    setCategory(newValue);
  };
  const onSubmit = async (event) => {
    // event.preventDefault();
    setSaving(true);
    const formData = {
      category: category.value,
      colors: Array.isArray(value) ? value.map((opt) => opt.value) : [],
      pattern: isToggled ? pattern : "",
      photoUrl: photoUrl,
      email: email,
    };

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await incrementCount(email);
        setCount(count + 1);
        setSaving(false);
        toast({
          title: "Item saved successfully",
          description: "Your item has been saved successfully.",
          variant: "success",
          duration: 3000,
        });

        router.back();
      } else {
        toast({
          title: "Failed to save the item",
          description: "Please try again later.",
          variant: "destructive",
          duration: 3000,
        });
        setSaving(false);
        console.error("Failed to save the item");
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Failed to save the item",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
      console.error("Error submitting the form", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto scrollbar-hide">
      <div className="max-w-md mx-auto  lg:max-w-4xl lg:gap-20 xl:max-w-5xl h-full  w-full  flex-col lg:justify-between lg:flex-row flex gap-5">
        {!imgUpload && uploadedImage.length === 0 && (
          <div className="w-full h-[80%] flex justify-center items-center ">
            <label
              htmlFor="fileInput"
              className="w-full cursor-pointer h-full bg-primary-foreground hover:bg-muted-foreground hover:text-background hover:border-background border-dashed border-2 rounded-md flex flex-col items-center justify-center gap-2 p-3 transition-all duration-300 ease-in outline-none"
            >
              <input
                id="fileInput"
                type="file"
                accept="image/heic,image/heic-sequence,image/*"
                className="hidden"
                onChange={grabImage}
              />
              <FiUpload className="w-12 h-12" />
              <p className="text-2xl font-bold tracking-wider capitalize">
                Upload image
              </p>
            </label>
          </div>
        )}

        {imgUpload && (
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-full h-full bg-primary-foreground hover:bg-muted-foreground hover:text-background hover:border-background border-dashed border-2 rounded-md flex flex-col items-center justify-center gap-2 p-3 transition-all duration-300 ease-in outline-none">
              <span className="loader"></span>
              Loading...
            </div>
          </div>
        )}

        {!imgUpload && uploadedImage.length > 0 && (
          <div className="flex flex-col w-full h-full">
            <label>Original Image</label>
            <div className=" w-full h-full -rotate-90 flex justify-center items-center bg-primary-foreground border-dashed border-2 rounded-md gap-2 p-3 transition-all duration-300 ease-in outline-none">
              <div className="aspect-square  w-full h-full  relative rounded-md">
                <Image
                  priority
                  src={uploadedImage}
                  alt="clothes"
                  fill
                  className="object-cover rounded-sm "
                />
              </div>
            </div>
          </div>
        )}

        {uploadedImage.length > 0 ? (
          loading === true ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="w-full h-full bg-primary-foreground hover:bg-muted-foreground hover:text-background hover:border-background  border-dashed border-2 rounded-md flex flex-col items-center justify-center gap-2 p-3 transition-all duration-300 ease-in outline-none">
                <span className="loader"></span>
                Loading...
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full">
              <label>After fetching Metadata</label>
              <div className="w-full h-full flex -rotate-90 justify-center items-center ">
                <div className="aspect-square w-full h-full relative rounded-md">
                  {showImage && (
                    <Image
                      priority
                      src={uploadedImage}
                      alt="clothes"
                      fill
                      className="object-cover rounded-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          )
        ) : null}
      </div>

      {uploadedImage.length > 0 && (
        <div className="mt-5 py-10">
          <form className="w-full pb-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row md:justify-between w-full gap-5">
              <div className="w-full">
                <label>Category</label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={groupedOptions}
                      formatGroupLabel={formatGroupLabel}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: "#f0f0f0",
                          neutral5: "#fff",
                          neutral90: "#f0f0f0",
                        },
                      })}
                      className="text-gray-900"
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                        handleSelectChange(selectedOption);
                      }}
                    />
                  )}
                />
                {errors.category && (
                  <p className="text-red-500">{errors.category.message}Error</p>
                )}
              </div>
              <div className="w-full">
                <label>Color</label>
                <Controller
                  name="selectedOption"
                  control={control}
                  rules={{ required: "Please select at least one color" }}
                  render={({ field }) => (
                    <CreatableSelect
                      {...field}
                      isClearable
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      options={options}
                      value={value}
                      isMulti
                      className="text-gray-900"
                      onChange={(newValue, actionMeta) => {
                        if (
                          actionMeta.action === "remove-value" ||
                          actionMeta.action === "clear"
                        ) {
                          field.onChange(newValue || []);
                          setValue(newValue || []);
                        } else {
                          field.onChange(newValue);
                          setValue(newValue);
                        }
                      }}
                      onCreateOption={handleCreate}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: "#f0f0f0",
                          neutral5: "#fff",
                          neutral90: "#f0f0f0",
                        },
                      })}
                    />
                  )}
                />

                {errors.selectedOption && (
                  <p className="text-red-500">
                    {errors.selectedOption.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full py-10">
              <div className="mt-5 flex flex-col ">
                <label className="mb-2">Patterns or Design</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isToggled}
                    onChange={toggleSwitch}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              {isToggled && (
                <div className="mt-5 flex flex-col">
                  <label>Describe it</label>
                  <input
                    placeholder="Stripped lines on the bottom"
                    type="text"
                    autoComplete={"off"}
                    className="w-full rounded-md p-2 bg-background border  border-popover-foreground"
                    onChange={(e) => setPattern(e.target.value)}
                  />
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              {saving ? (
                <div className="flex items-center justify-center gap-2">
                  <CgSpinner className="animate-spin w-8 h-8" />
                </div>
              ) : (
                "Add Item"
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UploadingForm;
