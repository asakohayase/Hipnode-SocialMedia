import { InterviewCategory, InterviewPost, StartInterview } from "@/components";
import PageWrapper from "@/components/PageWrapper";
import PodcastsPreview from "@/components/interviews/podcasts/PodcastsPreview";
import UserModel from "@/models/User";
import { getAllInterviews } from "@/utils/actions/interview.action";
import { getServerSession } from "next-auth";

const InterviewHomePage = async () => {
  const result = await getAllInterviews({});

  const currentUser: any = await getServerSession();
  const { email } = currentUser?.user;
  const User = await UserModel.findOne({ email });
  const currentUserId = User?._id.toString();

  return (
    <PageWrapper>
      <aside className="order-2 md:order-1">
        <InterviewCategory
          categories={[
            "technology",
            "marketing",
            "finance",
            "education",
            "healthcare",
          ]}
        />
      </aside>
      <section className="order-3 flex w-full flex-col gap-5 md:order-2">
        {result.interviews.length > 0
          ? result.interviews?.map((interview) => (
              <InterviewPost
                key={interview._id}
                _id={interview._id.toString()}
                image={interview.image}
                title={interview.title}
                username={interview.userId?.username || "unknown"}
                createdAt={interview.createdAt}
                content={interview.desc}
                revenue={interview.revenue}
                updates={interview.updates}
                website={interview.website}
                userId={JSON.stringify(interview.userId._id) || "unknown"}
                showEdit={interview.userId?._id.toString() === currentUserId}
              />
            ))
          : "No Posts to Show!"}
      </section>
      {/* Right Side Content */}
      <aside className="order-1 flex w-full flex-col gap-5 md:order-3 md:max-w-[325px]">
        {/* Start your interview */}
        <StartInterview />
        {/* Podcasts */}
        <PodcastsPreview />
      </aside>
    </PageWrapper>
  );
};

export default InterviewHomePage;
