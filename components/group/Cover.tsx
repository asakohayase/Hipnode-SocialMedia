"use client";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "./Modal";
import FillIcon from "../icons/FillIcon";

const Cover = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="bg-background dark:bg-dark3 flex h-[9.5rem] w-[20.9375rem] shrink-0 flex-col gap-[.625rem] rounded-[1rem] p-[.625rem] sm:h-[18.375rem] sm:w-full">
      <div className="flex sm:hidden">
        <Image src="/GroupCover.png" alt="GroupCover" width={315} height={75} />
      </div>
      <div className="hidden sm:flex">
        <Image
          src="/GroupCover.png"
          alt="GroupCover"
          width={780}
          height={174}
        />
      </div>
      <div className="mt-[.88rem] flex justify-between sm:mt-[1.25rem]">
        <div className="flex items-center gap-[.86rem]">
          <div>
            <Image
              src="/CompanyLogo.png"
              alt="GroupCover"
              width={40}
              height={40}
            />
          </div>
          <div className="flex flex-col">
            <div>
              <h2 className="display-semibold md:h1-semibold text-secondary2 dark:text-background2">
                Design Discussion
              </h2>
            </div>
            <div className="flex gap-[.31rem]">
              <p className="text-sm-regular sm:body-regular text-secondary3">
                Created by
              </p>
              <p className="caption-semibold sm:body-semibold text-secondary2 dark:text-background2 ">
                AR Jakir
              </p>
            </div>
          </div>
        </div>
        <div onClick={() => console.log("Clicked")}>
          <button
            className="flex h-10 items-center gap-[.62rem] self-center bg-background2 p-[.62rem] dark:bg-dark4"
            onClick={() => setShow((s) => !s)}
          >
            <div>
              <FillIcon.Leave className="fill-secondary3" />
            </div>
            <p className="caption-semibold text-secondary3">Leave</p>
          </button>
          <Modal show={show} closeModal={() => setShow(false)} />
        </div>
      </div>
    </div>
  );
};

export default Cover;