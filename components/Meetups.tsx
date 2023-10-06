"use client";
import React from "react";
import OutlineIcon from "./icons/OutlineIcon";
import MeetupCard from "./MeetupCard";

const Meetups = () => {
  return (
    <div className="flex w-[325px] flex-col gap-[10px] rounded-[16px] bg-background p-[20px] dark:bg-dark3">
      <section className="display-semibold mb-5 flex flex-row gap-2">
        <p>Meetups</p>
        <div className="mt-0.5">
          <OutlineIcon.ArrowLeft />
        </div>
      </section>
      <div className="flex flex-col gap-[20px] rounded-[16px] dark:bg-dark3">
        <MeetupCard
          month="FEB"
          day={7}
          title="UIHUT - Crunchbase Company Profile"
          desc="UIHUT  •  Sylhet, Bangladesh"
          jobType={["remote", "Part-time", "Worldwide"]}
        />
        <MeetupCard
          month="MAR"
          day={17}
          title="UIHUT - Crunchbase Company Profile"
          desc="UIHUT  •  Sylhet, Bangladesh"
          jobType={["remote", "Part-time"]}
        />
      </div>
    </div>
  );
};

export default Meetups;
