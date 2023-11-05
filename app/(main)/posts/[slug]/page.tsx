import { getSession } from "next-auth/react";

import MoreFrom from "@/components/home/MoreFrom";
import PostDate from "@/components/home/PostDate";
import ActionBar from "@/components/shared/ActionBar";
import OpenedPost from "@/components/shared/OpenedPost";
import MyProfile from "@/components/home/MyProfile";
import { Thread } from "@/components/home/Thread";
import { commentData } from "@/constants/dummy";
import { getPostById, getPostsByUserId } from "@/utils/actions/post.action";

const Page = async ({ params }: { params: { slug: string } }) => {
  const session = await getSession();
  console.log(session?.user);
  const loggedinUserId = session?.user?.id;

  const postopen = await getPostById(params.slug);
  console.log(postopen.data);

  if (!postopen.success) return <div>Post Not Found</div>;
  const {
    _id,
    title,
    tags,
    content,
    userId,
    createdAt,
    image,
    likes,
    comments,
    shares,
    reports,
  } = postopen.data;

  const morePosts = await getPostsByUserId(userId._id, postopen.data._id);
  const posts = morePosts.data;

  return (
    <article className="flex min-h-screen flex-col gap-5 bg-background2 p-5 dark:bg-dark2 md:flex-row md:px-10">
      <section className="w-full md:order-2">
        <OpenedPost image={image} title={title} tags={tags} content={content} />
        <div className="my-5 flex flex-col gap-5 md:hidden">
          <ActionBar
            postId={_id}
            userId={loggedinUserId}
            hasLiked={likes.includes(loggedinUserId)}
            hasCommented={comments.includes(loggedinUserId)}
            hasShared={shares.includes(loggedinUserId)}
            hasreported={reports.includes(loggedinUserId)}
          />
          {/* implement later- show PostDate only if it is your own post */}
          {/* implement later- if group id existed, display GroupPostDate instead */}
          <PostDate username={userId.username} createdAt={createdAt} />
        </div>
        <Thread commentData={commentData} />
      </section>
      <div className="hidden flex-col gap-5 md:order-1 md:flex">
        <ActionBar />
        {/* implement later- show PostDate only if it is your own post */}
        {/* implement later- if group id existed, display GroupPostDate instead */}
        <PostDate username={userId.username} createdAt={createdAt} />
      </div>
      <div className="flex flex-col gap-5 md:order-3">
        {/* implement later- if user id is equal to someone you follow, display FollowedProfile and if the user id is equal to someone you are not following, display OtherProfile */}
        <MyProfile user={userId} joinedDate={userId.createdAt} />
        <MoreFrom posts={posts} />
      </div>
    </article>
  );
};

export default Page;
