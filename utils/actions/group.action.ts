"use server";

import { getServerSession } from "next-auth";

import Group from "@/models/group.model";
import Post from "@/models/post.model";
import UserModel from "@/models/User";
import dbConnect from "@/utils/mongooseConnect";
import { FilterQuery } from "mongoose";
import { NewGroup, UpdateGroup } from "./shared.types";
import { revalidatePath } from "next/cache";

export async function createGroup(params: NewGroup) {
  try {
    await dbConnect();
    // get the current user
    const currentUser: any = await getServerSession();
    const { email } = currentUser?.user;
    const User = await UserModel.findOne({ email });
    const { title, coverUrl, groupUrl, description, admins, members } = params;
    const parsedAdmins = JSON.parse(admins);
    const parseMembers = JSON.parse(members);
    const activities = [];
    for (let i = 0; i < parseMembers.length; i++) {
      activities.push({
        date: new Date(),
        activityType: "new_member",
      });
    }
    const group = await Group.create({
      title,
      coverUrl,
      groupUrl,
      userId: User?._id,
      description,
      admins: parsedAdmins,
      members: parseMembers,
      activity: activities,
    });
    if (group) {
      return JSON.stringify({
        success: true,
        message: "Group created successfully!",
        id: group._id,
      });
    } else {
      throw new Error("Failed to create a group.");
    }
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      success: false,
      message: "An error occurred while creating the group.",
    });
  }
}

export async function getGroupById(groupId: string) {
  try {
    await dbConnect();
    const group = await Group.findById(groupId)
      .populate("userId")
      .populate("admins")
      .populate("members");

    if (group) {
      return { success: true, data: group };
    } else {
      throw new Error("Group not found.");
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while retrieving the group.",
    };
  }
}

export async function joinGroup(groupId: string) {
  try {
    await dbConnect();
    const user = await getServerSession();
    const { email } = user?.user ?? { email: undefined };
    const userObj = await UserModel.find({ email });
    const group = await Group.findById(groupId);

    if (group) {
      if (group.members.includes(userObj[0]._id)) {
        return { success: false, message: "Member is already in the group." };
      }

      group.members.push(userObj[0]._id);
      group.activity.push({
        date: new Date(),
        activityType: "new_member",
      });

      await group.save();
      revalidatePath(`groups/${groupId}`);

      return { success: true };
    } else {
      throw new Error("Group not found.");
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while joining the group.",
    };
  }
}

export async function isMember(groupId: string) {
  try {
    await dbConnect();
    const user = await getServerSession();
    const { email } = user?.user ?? { email: undefined };
    const userObj = await UserModel.findOne({ email });
    const group = await Group.findById(groupId);

    if (group) {
      const isMember = group.members.includes(userObj?._id);

      return { success: true, isMember };
    }
    revalidatePath(`groups/${groupId}`);

    return { success: false, isMember: false };
  } catch (error) {
    return { success: false, error };
  }
}

export async function leaveGroup(groupId: string) {
  try {
    await dbConnect();
    const user = await getServerSession();
    const { email } = user?.user ?? { email: undefined };
    const userObj = await UserModel.find({ email });
    const group = await Group.findById(groupId);

    if (group) {
      const memberIndex = group.members.indexOf(userObj[0]._id);
      if (memberIndex === -1) {
        return { success: false, message: "Member is not in the group." };
      }

      group.members.splice(memberIndex, 1);

      await group.save();
      revalidatePath(`groups/${groupId}`);
      return { success: true };
    } else {
      throw new Error("Member not found.");
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while leaving the group.",
    };
  }
}

export async function updateGroup(groupId: any, params: UpdateGroup) {
  const { title, coverUrl, groupUrl, description, admins, members } = params;
  const currentUser: any = await getServerSession();
  const { email } = currentUser?.user;
  const User = await UserModel.findOne({ email });
  const parsedAdmins = JSON.parse(admins);
  const parseMembers = JSON.parse(members);

  try {
    await dbConnect();
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId },
      {
        $set: {
          title,
          coverUrl,
          groupUrl,
          description,
          userId: User?._id,
          admins: parsedAdmins,
          members: parseMembers,
        },
      }
    );

    if (updatedGroup) {
      return { success: true, message: "Group updated successfully" };
    } else {
      throw new Error("Failed to update the group.");
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while updating the group.",
    };
  }
}

export async function deleteGroup(groupId: string) {
  try {
    await dbConnect();
    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (deletedGroup) {
      return { success: true, message: "Group deleted successfully" };
    } else {
      throw new Error("Failed to delete the group.");
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while deleting the group.",
    };
  }
}

export async function getUsersBySimilarName(name: string) {
  try {
    await dbConnect();
    const users = await UserModel.find({
      username: { $regex: name, $options: "i" },
    }).select("username");
    return JSON.stringify(users);
  } catch (error) {
    return "[]";
  }
}

export async function getAllGroups(params: {
  search: string;
  category: string;
}) {
  const { search, category } = params;
  try {
    await dbConnect();

    const query: FilterQuery<any> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
      ];
    }

    if (category === "popular") {
      const sorted = await Group.aggregate([
        {
          $project: {
            count: { $size: "$members" },
            title: true,
            coverUrl: true,
            groupUrl: true,
            description: true,
            userId: true, // Make sure to include the userID field here
          },
        },
        {
          $lookup: {
            from: "users", // Replace with the actual name of your user collection
            localField: "userId", // The field from the 'Group' collection
            foreignField: "_id", // The field from the 'User' collection
            as: "userData", // The name of the new array field to hold the joined data
          },
        },
        { $unwind: "$userData" }, // Optional: Unwind the array if you expect one user per group
        {
          $lookup: {
            from: "posts", // Replace with the actual name of your posts collection
            let: { groupId: "$_id" }, // Define a variable 'groupId' for use in the pipeline
            pipeline: [
              { $match: { $expr: { $eq: ["$groupId", "$$groupId"] } } }, // Match posts with the current group
              { $limit: 1 }, // Limit to 1 post
            ],
            as: "post", // The name of the field to hold the post
          },
        },
        { $unwind: "$post" }, // Optional: Unwind the array if you expect one post per group
        { $sort: { count: -1 } },
      ]);
      return { groups: sorted };
    } else if (category === "newest") {
      query.createdAt = { $exists: true };
    } else if (category === "fastestgrowing") {
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 7);

      const fastestGrowingGroups = await Group.aggregate([
        {
          $match: {
            "activity.date": { $gte: startDate, $lte: currentDate },
            "activity.activityType": "new_member",
          },
        },
        {
          $group: {
            _id: "$_id",
            newMembers: { $sum: -1 },
          },
        },
        {
          $sort: { newMembers: 1 },
        },
      ]);

      const fastestGrowingGroupIds = fastestGrowingGroups.map(
        (group) => group._id
      );
      query._id = { $in: fastestGrowingGroupIds };
    }

    let mainQueryPromise = Group.find(query).populate("userId");
    let postQueryPromise = Group.find(query);

    if (category === "newest") {
      mainQueryPromise = mainQueryPromise.sort({ createdAt: -1 });
      postQueryPromise = postQueryPromise.sort({ createdAt: -1 });
    }

    const [groups, postsResults] = await Promise.all([
      mainQueryPromise,
      Promise.all(
        (await postQueryPromise).map((group) =>
          Post.find({ groupId: group._id })
        )
      ),
    ]);

    const returnGroups = groups.map((group, index) => ({
      ...group._doc,
      post: postsResults[index],
    }));
    return { groups: returnGroups };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function findById(admins: any) {
  try {
    await dbConnect();
    const users = await UserModel.find({
      _id: { $in: admins },
    }).select("username");
    return JSON.stringify(users);
  } catch (error) {
    return "[]";
  }
}

export async function findAllGroups() {
  try {
    await dbConnect();
    const groups = await Group.find({});
    return JSON.stringify(groups);
  } catch (error) {
    return "[]";
  }
}

export async function getNewestGroups() {
  try {
    await dbConnect();
    const groups = await Group.find({})
      .sort({ createdAt: -1 })
      .populate("userId");
    return { success: true, groups };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      groups: [],
    };
  }
}

export async function getMostPopularGroups() {
  try {
    await dbConnect();
    const sorted = await Group.aggregate([
      {
        $project: {
          // add a field to the results, called "count" which is the "size" of the "members" array
          count: { $size: "$members" },
          title: true,
          coverUrl: true,
          groupUrl: true,
          description: true,
        },
      },
      { $sort: { count: -1 } }, // sort descending
      { $limit: 3 }, // only grab 3
    ]);

    return sorted;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while retrieving the group.",
    };
  }
}

export async function getFastestGrowingGroups() {
  try {
    await dbConnect();

    const currentDate = new Date();

    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 7);

    const result = await Group.aggregate([
      {
        $unwind: "$activity",
      },
      {
        $match: {
          "activity.date": { $gte: startDate, $lte: currentDate },
          "activity.activityType": "new_member",
        },
      },
      {
        $group: {
          _id: "$_id",
          newMembers: { $sum: 1 },
          groupUrl: { $first: "$groupUrl" },
          title: { $first: "$title" },
          description: { $first: "$description" },
        },
      },
      {
        $sort: { newMembers: -1 },
      },
      {
        $limit: 3,
      },
    ]);
    // Stringify result and parse
    const jsonString = JSON.stringify({
      success: true,
      groups: result,
    });

    const parsedResult = JSON.parse(jsonString);

    return parsedResult;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while retrieving the group.",
    };
  }
}
