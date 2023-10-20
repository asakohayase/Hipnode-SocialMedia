"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

import {
  BusinessStage,
  BusinessType,
  CodeLevel,
} from "@/components/signup/questionaire";
import Divider from "@/components/signup/Divider";
import FillIcon from "@/components/icons/FillIcon";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/ui/Button";
import { useSignUpStore, useStageStore } from "@/store";

// define sign up stages
const STAGES = {
  SIGNUP: "signUp",
  BUSINESS_STAGE: "businessStage",
  CODING_LEVEL: "codingLevel",
  BUSINESS_TYPE: "businessType",
};

const SignUp = () => {
  // set initial stage to sign up
  const { currentStage, setCurrentStage } = useStageStore();
  const { username, BusinessInterest, CodingLevel, Stage, updateUsername } =
    useSignUpStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const flag = false;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const userResponse = () => {
    return {
      username,
      Stage,
      CodingLevel,
      BusinessInterest,
    };
  };
  // handle next stage flow
  const nextStage = () => {
    switch (currentStage) {
      case STAGES.SIGNUP:
        setCurrentStage("businessStage");
        updateUsername(formData.username);
        break;
      case STAGES.BUSINESS_STAGE:
        setCurrentStage("codingLevel");
        break;
      case STAGES.CODING_LEVEL:
        setCurrentStage("businessType");
        break;
      case STAGES.BUSINESS_TYPE:
        setCurrentStage("signUp"); // Loop back to the start for a continuous flow
        console.log(userResponse());
        break;
      default:
        setCurrentStage("signUp");
        break;
    }
  };

  // render signup stages based on current stage
  const RenderStage = () => {
    switch (currentStage) {
      case STAGES.BUSINESS_STAGE:
        return <BusinessStage />;
      case STAGES.CODING_LEVEL:
        return <CodeLevel />;
      case STAGES.BUSINESS_TYPE:
        return <BusinessType />;
    }
  };

  return (
    <>
      {currentStage === "signUp" ? (
        <article className="mx-auto flex w-[327px] flex-col gap-[29px] sm:w-[442px] md:my-auto">
          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              {flag ? (
                <>
                  <h1 className="h3-semibold text-secondary2 dark:text-background2">
                    Choose a username
                  </h1>
                  <Input
                    name="username"
                    divClassName="bg-background rounded-lg px-5 py-[13px] md:bg-background2 dark:bg-dark2"
                    className="w-full bg-transparent md:text-secondary2 md:placeholder:text-secondary2 md:dark:text-background2 "
                    onChange={handleChange}
                    value={formData.username}
                    placeholder="e.g Hipnode123"
                  />
                </>
              ) : (
                <>
                  <h1 className="h3-semibold text-secondary2 dark:text-background2">
                    Email
                  </h1>
                  <Input
                    name="email"
                    divClassName="bg-background rounded-lg px-5 py-[13px] md:bg-background2 dark:bg-dark2"
                    className="w-full bg-transparent md:text-secondary2 md:placeholder:text-secondary2 md:dark:text-background2 "
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="hello@gmail.com"
                  />
                  <h1 className="h3-semibold text-secondary2 dark:text-background2">
                    Password
                  </h1>
                  <Input
                    name="password"
                    divClassName="bg-background rounded-lg px-5 py-[13px] md:bg-background2 dark:bg-dark2"
                    className="w-full bg-transparent md:text-secondary2 md:placeholder:text-secondary2 md:dark:text-background2 "
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="uikit.to074#"
                  />
                </>
              )}
            </div>
            <div>
              <Button
                onClick={nextStage}
                disabled={!formData.username}
                className="px-10 py-2.5"
              >
                Next
              </Button>
            </div>
            <p className="body-regular text-secondary2 dark:text-background2">
              Already have an account?{" "}
              <Link href={"/"}>
                <span className="font-semibold text-red80">Sign in</span>
              </Link>
            </p>
          </div>
          <div className="w-full">
            <Divider />
          </div>
          <div className="flex w-full flex-col gap-5">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              full
              color="gray"
              className="display-semibold items-center justify-center py-3 md:bg-secondary6"
            >
              <FillIcon.Google className="fill-secondary2 dark:fill-background2" />

              <p>Sign Up With Google</p>
            </Button>
            <Button
              onClick={() => signIn("facebook", { callbackUrl: "/" })}
              full
              color="gray"
              className="display-semibold items-center justify-center py-3 md:bg-secondary6"
            >
              <FillIcon.Facebook className="fill-secondary2 dark:fill-background2" />

              <p>Sign Up With Facebook</p>
            </Button>
          </div>
        </article>
      ) : (
        <>
          <article className="mx-auto flex w-[327px] flex-col gap-10 sm:w-[442px] md:my-auto">
            <RenderStage />
            <div className="flex w-full flex-col gap-5">
              <div>
                <Button
                  onClick={nextStage}
                  disabled={!formData.username}
                  className="px-10 py-2.5"
                >
                  Next
                </Button>
              </div>
              <p className="body-regular text-secondary2 dark:text-background2">
                Already have an account?{" "}
                <Link href={"/"}>
                  <span className="font-semibold text-red80">Sign in</span>
                </Link>
              </p>
            </div>
          </article>
        </>
      )}
    </>
  );
};

export default SignUp;
