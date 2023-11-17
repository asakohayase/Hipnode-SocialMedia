import { getPostById, getPostsByUserId } from "@/utils/actions/post.action";
import {
  ActionBar,
  GroupPostDate,
  MyProfile,
  MoreFrom,
  OpenedPost,
  PostDate,
  Thread,
  OtherProfile,
} from "@/components";
import { getCurrentUserId } from "@/utils/actions/user.action";

const Page = async ({ params }: { params: { slug: string } }) => {
  const currentUserId = await getCurrentUserId();

  const postopen = await getPostById(params.slug);

  if (!postopen.success) return <div>Post Not Found</div>;
  const {
    _id,
    title,
    tags,
    content,
    userId,
    groupId,
    createdAt,
    image,
    likes,
    comments,
    shares,
    reports,
  } = postopen.data;

  const getMorePosts = await getPostsByUserId(userId?._id, postopen.data._id);
  const morePosts = getMorePosts.data;

  return (
    <article className="flex min-h-screen flex-col gap-5 bg-background2 p-5 dark:bg-dark2 md:flex-row md:px-10">
      <section className="w-full md:order-2">
        <OpenedPost
          image={image}
          title={title}
          tags={tags}
          content={content}
          postId={params.slug}
        />
        <div className="my-5 flex flex-col gap-5 md:hidden">
          <ActionBar
            postId={JSON.stringify(_id)}
            userId={JSON.stringify(currentUserId)}
            hasLiked={likes?.includes(currentUserId)}
            // hasCommented={comments?.includes(currentUserId)}
            hasShared={shares?.includes(currentUserId)}
            hasReported={reports?.includes(currentUserId)}
            likes={likes?.length}
            comments={comments?.length}
            shares={shares?.length}
          />
          {groupId && (
            <GroupPostDate
              username={userId.username}
              createdAt={createdAt}
              groupTitle={groupId?.title}
            />
          )}
          {!groupId && userId?._id.equals(currentUserId) && (
            <PostDate username={userId.username} createdAt={createdAt} />
          )}
        </div>
        {comments && (
          <Thread
            currentUserId={JSON.stringify(currentUserId)}
            postId={params.slug}
            comments={comments}
          />
        )}
      </section>
      <div className="hidden flex-col gap-5 md:order-1 md:flex md:min-w-[210px]">
        <ActionBar
          postId={JSON.stringify(_id)}
          userId={JSON.stringify(currentUserId)}
          hasLiked={likes?.includes(currentUserId)}
          // hasCommented={comments?.includes(currentUserId)}
          hasShared={shares?.includes(currentUserId)}
          hasReported={reports?.includes(currentUserId)}
          likes={likes?.length}
          comments={comments?.length}
          shares={shares?.length}
        />
        {groupId && (
          <GroupPostDate
            username={userId.username}
            createdAt={createdAt}
            groupTitle={groupId.title}
          />
        )}
        {!groupId && userId?._id.equals(currentUserId) && (
          <PostDate username={userId.username} createdAt={createdAt} />
        )}
      </div>
      <div className="flex flex-col gap-5 md:order-3 md:min-w-[325px]">
        {userId?._id &&
          currentUserId &&
          (userId?._id.equals(currentUserId) ? (
            <MyProfile
              user={JSON.stringify(userId)}
              joinedDate={userId.createdAt}
            />
          ) : (
            <OtherProfile
              user={JSON.stringify(userId)}
              joinedDate={userId.createdAt}
              currentUserId={JSON.stringify(currentUserId)}
              hasFollowed={userId.followers?.includes(currentUserId)}
            />
          ))}{" "}
        {userId?._id && morePosts && (
          <MoreFrom
            posts={JSON.stringify(morePosts)}
            author={userId?.username}
          />
        )}
      </div>
    </article>
  );
};

export default Page;
