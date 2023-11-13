"use client";
import React, { useState } from "react";
import OutlineIcon from "../icons/OutlineIcon";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface CoverImageProps {
  setParentFormData: (prevData: any) => void;
  defaultImage?: string;
}

const CoverImage: React.FC<CoverImageProps> = ({
  setParentFormData,
  defaultImage,
}) => {
  const [imageUrl, setImageUrl] = useState(defaultImage || "");

  const updateForm = (url: any) => {
    setParentFormData((prevData: any) => ({
      ...prevData,
      coverUrl: url,
    }));
  };

  return (
    <div>
      <CldUploadWidget
        uploadPreset="bl8ltxxe"
        onUpload={(result: any) => {
          updateForm(result?.info?.secure_url);
          setImageUrl(result?.info?.secure_url);
        }}
      >
        {({ open }) => {
          function handleOnClick(e: React.MouseEvent) {
            e.preventDefault();
            open();
          }
          return (
            <div className="mb-[1.25rem]">
              <div className="flex">
                <button
                  onClick={handleOnClick}
                  className="w-[6rem] flex px-[.625rem] py-[.25rem] gap-[.625rem] items-center rounded-[.25rem] bg-background2 dark:bg-dark4"
                >
                  <OutlineIcon.Image1 className="fill-black dark:fill-white w-[22px]" />
                  <p className="text-sm-regular text-secondary2 dark:text-background">
                    Set Cover
                  </p>
                </button>
              </div>
            </div>
          );
        }}
      </CldUploadWidget>
      <div className="w-full h-[8.25rem] lg:h-[10.4rem] flex justify-center items-center dark:bg-dark4 dark:border-dark4 bg-background2 border-background">
        {!imageUrl ? (
          <OutlineIcon.Image2 className="dark:stroke-secondary4 dark:fill-dark4 h-[1.875rem] w-[1.875rem] fill-white lg:h-[2.5rem] lg:w-[2.5rem]" />
        ) : (
          <div>
            <div>
              <Image
                src={imageUrl}
                alt={"Cover"}
                width={840}
                height={167}
                className="h-[167px] w-[840px] lg:h-[223px] lg:w-[1120px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverImage;
