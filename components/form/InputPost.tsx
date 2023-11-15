"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "../ui/badge";
import { PostSchema } from "@/lib/validations";
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "../ui/form";
import { Button } from "../ui/Button";
import OutlineIcon from "../icons/OutlineIcon";
import { useTheme } from "next-themes";
import PostCategory from "../home/PostCategory";
import { CldUploadWidget } from "next-cloudinary";
import { createPost } from "@/utils/actions/post.action";

export function InputPost() {
  const { theme } = useTheme();

  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [coverUrl, setCoverUrl] = useState("");

  const router = useRouter();

  const [expanded, setExpanded] = useState(0);
  const [create, setCreate] = useState("Post");

  const toggleCategory = () => {
    setExpanded(expanded !== 2 ? 2 : 0);
  };

  const closeCategory = (val: any) => {
    setExpanded(0);
    setCreate(val);
  };

  const updateForm = (url: string) => {
    setCoverUrl(url);
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      contents: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const values = form.getValues();
      const postData = {
        title: values.title,
        content: values.contents,
        tags: values.tags,
        image: coverUrl,
        avatar: "/Avatar.png",
      };
      const id = await createPost(postData);
      console.log(id);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputKeydown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters.",
          });
        }
        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-2xl bg-background p-5 dark:bg-dark3"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="mb-10">
              <FormControl className="flex flex-col">
                <div className="gap-5">
                  <Input
                    placeholder="Title..."
                    className="h3-semibold md:h1-semibold border-none bg-background2 text-secondary2 placeholder:text-secondary3 dark:bg-dark4 dark:text-background2"
                    {...field}
                  />
                  <div className="flex justify-between md:justify-start md:gap-5">
                    <CldUploadWidget
                      uploadPreset="bl8ltxxe"
                      onUpload={(result: any) => {
                        updateForm(result?.info?.secure_url);
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
                              <Button
                                color="blackWhite"
                                type="button"
                                onClick={handleOnClick}
                                className="items-center justify-between px-2.5 py-2 text-secondary2 dark:text-background2"
                              >
                                <OutlineIcon.Image1 />
                                <p className="text-xs-regular md:text-xs-semibold text-secondary2 dark:text-background2">
                                  Set Cover
                                </p>
                              </Button>
                            </div>
                          </div>
                        );
                      }}
                    </CldUploadWidget>

                    <Button
                      color="blackWhite"
                      className="items-center justify-between px-2.5 py-2"
                    >
                      <p className="text-xs-regular md:text-xs-semibold text-secondary2 dark:text-background2">
                        Select Group
                      </p>
                      <OutlineIcon.DownArrow className="h-3 w-3 fill-secondary6 dark:fill-secondary3" />
                    </Button>
                    <div className="relative">
                      <Button
                        color="blackWhite"
                        className="items-center justify-between px-2.5 py-2"
                        type="button"
                        onClick={toggleCategory}
                      >
                        <p className="text-xs-regular md:text-xs-semibold text-secondary2 dark:text-background2">
                          <span className="text-secondary3">Create</span> -{" "}
                          {create}
                        </p>
                        <OutlineIcon.DownArrow className="h-3 w-3 fill-secondary6 dark:fill-secondary3" />
                      </Button>
                      {expanded === 2 && (
                        <div className="absolute left-0 z-50 mt-2">
                          <PostCategory closeCategory={closeCategory} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red90" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents"
          render={({ field }) => (
            <FormItem>
              <div className="flex">
                <Link
                  href="/"
                  className="body-semibold md:display-semibold px-3.5 text-secondary2 dark:text-background2 md:hidden"
                >
                  Code of Conduct
                </Link>
              </div>
              <FormControl>
                <Editor
                  onEditorChange={(content) => field.onChange(content)}
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) =>
                    // @ts-ignore
                    (editorRef.current = editor)
                  }
                  key={theme}
                  initialValue="Tell your story..."
                  init={{
                    height: 376,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "print",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "paste",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar_mode: "floating",
                    skin: theme === "dark" ? "oxide-dark" : "oxide",
                    toolbar:
                      "codeofconduct h1 bold italic underline strikethrough link image alignleft aligncenter " +
                      "alignright bullist numlist",
                    mobile: {
                      toolbar:
                        "h1 bold italic underline strikethrough link image alignleft aligncenter " +
                        "alignright bullist numlist",
                      toolbar_mode: "floating",
                    },
                    content_css: theme === "dark" ? "dark" : "light",
                    setup: (editor) => {
                      editor.ui.registry.addButton("codeofconduct", {
                        text: "Code of Conduct",
                        onAction: () => {
                          window.open("/codeofconduct", "_blank");
                        },
                      });
                    },
                  }}
                />
              </FormControl>
              <FormMessage className="text-red90" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="my-5">
              <FormLabel className="caption-semibold md:body-semibold text-secondary2 dark:text-background2">
                Add or change tags (up to 5) so readers know what your story is
                about
              </FormLabel>
              <FormControl>
                <>
                  <Input
                    placeholder="Add a tag..."
                    className="caption-regular md:body-regular border-none bg-background2 text-secondary2 placeholder:text-secondary3 dark:bg-dark4 dark:text-background2"
                    onKeyDown={(e) => handleInputKeydown(e, field)}
                  />
                  {Array.isArray(field.value) && field.value.length > 0 && (
                    <div className="mt-2.5 flex items-start gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="flex items-center justify-center gap-2 rounded-md border-none bg-background px-4 py-2 capitalize text-secondary2 hover:bg-background/80 dark:bg-dark4 dark:text-background2 hover:dark:bg-dark4/80"
                          onClick={() => handleTagRemove(tag, field)}
                        >
                          {tag}
                          <OutlineIcon.Close className="cursor-pointer object-contain invert-0 dark:invert" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormMessage className="text-red90" />
            </FormItem>
          )}
        />

        <div className="flex justify-start gap-5">
          <Link href="/home">
            <Button
              type="submit"
              color="blue"
              className="md:display-semibold body-semibold px-10 py-2.5"
              disabled={isSubmitting}
              onClick={() => {
                onSubmit();
              }}
            >
              {isSubmitting ? <>Posting...</> : <>Publish</>}
            </Button>
          </Link>
          <Button
            type="button"
            color="gray"
            className="md:display-semibold body-semibold px-10 py-2.5"
            onClick={() => router.push("/")}
          >
            <p className="text-secondary3">Cancel</p>
          </Button>
        </div>
      </form>
    </Form>
  );
}
