"use client";
import { dummyTags } from "@/constants/dummy";
import { formatNumber } from "@/utils";
import React from "react";
import { Tags } from ".";
import PageWrapper from "../PageWrapper";
import OutlineIcon from "../icons/OutlineIcon";
import Image from "next/image";

const InterviewPage = ({ result }: any) => {
  return (
    <PageWrapper>
      <article className="mx-auto w-full max-w-[785px] rounded-2xl bg-bkg-2">
        <Image
          src={result.image}
          alt="Group Meeting"
          width={335}
          height={117}
          className="h-[117px] w-[335px] rounded-t-lg md:h-[273px] md:w-[785px]"
          priority
        />
        <div className="flex flex-col gap-5 px-5 pb-10 pt-5 sm:px-10">
          <h1 className="sm:h1-semibold font-semibold">{result.title}</h1>
          <div className="flex flex-row justify-between">
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <p className="text-sm font-bold">
                  ${formatNumber(result.revenue)}/mo
                </p>
                <small className="text-xs text-secondary3">Revenue</small>
              </div>
              <div className="flex flex-col items-center border-l-2 border-solid border-gray-500 pl-6">
                <p className="text-sm font-bold">{result.updates}</p>
                <small className="text-xs text-secondary3">Updates</small>
              </div>
              <div
                className="flex flex-col items-center border-l-2 border-solid border-gray-500 pl-6"
                onClick={() =>
                  window.open(`https://${result.website}`, "_blank")
                }
              >
                <p className="text-sm font-bold">
                  <OutlineIcon.Web className="fill-secondary2 dark:fill-background2" />
                </p>
                <small className="text-xs text-secondary3">Website</small>
              </div>
            </div>
            <Tags tags={dummyTags} />
          </div>
          <p className="text-secondary3">{result.desc}</p>
        </div>
      </article>
    </PageWrapper>
  );
};

export default InterviewPage;
