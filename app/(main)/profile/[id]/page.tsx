import { Meetups, StartInterview } from "@/components";

import ProfileNavigation from "@/components/profile/ProfileNavigation";
import ProfileDetails from "@/components/profile/ProfileDetails";

import { getUserProfile } from "@/utils/actions/user.action";
import React from "react";

export default async function Profile({ params }: { params: { id: string } }) {
  const profileData = await getUserProfile(params.id, ["followers"]);
  //   console.log("user: ", profileData);
  return (
    <main className="xs:max-w-[320px] mx-auto mt-5 grid w-full max-w-[335px] grid-cols-1 justify-center gap-[1.25rem] sm:max-w-[550px] md:max-w-[1100px] md:grid-cols-[30%_auto] lg:max-w-[1400px] lg:grid-cols-[20%_56%_auto]">
      {/* Profile */}
      <section className="md:col-start-1 md:row-span-2 md:row-start-1">
        <ProfileDetails JSONProfileData={JSON.stringify(profileData)} />
      </section>
      {/* Start Your interview */}
      <section className="md:col-start-2 md:row-start-1 lg:col-start-3 lg:h-[168px]">
        <StartInterview />
      </section>

      {/* Profile Navigation */}
      <section className=" flex flex-col gap-[1.25rem] md:col-start-2 md:row-span-2 md:h-0 lg:row-span-2 lg:row-start-1">
        <ProfileNavigation />
      </section>

      {/* Meetups */}
      <section className="md:hidden">
        <Meetups />
      </section>

      {/* Performance */}
      <section className="hidden lg:col-start-3 lg:row-span-2 lg:flex">
        <div>
          {/* <div>Performance</div> */}
          <Meetups />
        </div>
      </section>
    </main>
  );
}
