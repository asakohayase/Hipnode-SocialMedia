import Image from "next/image";

import Link from "next/link";
import { PodcastDefault } from "@/utils/images";
import OutlineIcon from "@/components/icons/OutlineIcon";

const Preview = () => {
  return (
    <li className="">
      <Link href="/" className="flex items-center gap-3">
        <Image src={PodcastDefault} alt="Podcast Preview Image" />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold">
            Selling a Business and Scaling Another Amidst Tragedy.
          </p>
          <address className="text-2xs not-italic text-secondary3">
            by Michele Hansen
          </address>
        </div>
        <OutlineIcon.RightArrow />
      </Link>
    </li>
  );
};

export default Preview;
