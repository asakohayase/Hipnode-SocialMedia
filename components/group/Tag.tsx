import React from "react";

interface Props {
  title: string;
  icon: any;
  className: string;
  postNum: string;
  desc: string;
}

const Tag = ({ title, icon, className, postNum, desc }: Props) => {
  return (
    <article className="flex flex-row items-center gap-[10px] rounded-[6px] text-secondary4">
      <section
        className={`flex h-[32px] w-[32px] items-center justify-center gap-[10px] rounded-[6px] p-[6px] ${className}`}
      >
        {icon}
      </section>
      <section className="flex flex-col gap-[1px] py-1">
        <p className="caption-semibold ">#{title}</p>
        <p className="text-sm-regular">
          {postNum} {desc}
        </p>
      </section>
    </article>
  );
};

export default Tag;
