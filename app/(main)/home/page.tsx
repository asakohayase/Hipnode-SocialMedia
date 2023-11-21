import CreatePost from "@/components/home/CreatePost";
import Meetups from "@/components/home/Meetups";
import PinnedGroup from "@/components/home/PinnedGroup";
import PopularTags from "@/components/home/PopularTags";
import Post from "@/components/home/Post";
import Sidebar from "@/components/home/Sidebar";
import Podcasts from "@/components/Podcasts";
import { getAllPosts } from "@/utils/actions/post.action";
import React from "react";

export default async function Home() {
  const result = await getAllPosts({});

  return (
    <main className="page-formatting">
      <section className="flex flex-col md:gap-5">
        <div className="flex md:hidden lg:flex">
          <Sidebar />
        </div>
        <div className="hidden lg:flex">
          <PopularTags />
        </div>
        <div className="hidden lg:flex">
          <PinnedGroup />
        </div>
      </section>
      <section className="flex flex-col gap-5">
        <div className="hidden md:flex lg:hidden">
          <Sidebar small />
        </div>
        <CreatePost />
        {result.posts.length > 0
          ? result.posts.map((post) => (
              <Post
                key={post._id}
                _id={post._id}
                postImage={post.image}
                title={post.title}
                tags={post.tags}
                avatar={post.avatar}
                username={post.userId?.username || "unknown"}
                createdAt={post.createdAt}
                views={post?.views?.length}
                likes={post?.likes?.length}
                comments={post?.comments?.length}
              />
            ))
          : "No Posts to Show!"}
      </section>
      <section className="flex flex-col gap-5">
        <Meetups />
        <Podcasts />
      </section>
    </main>
  );
}
