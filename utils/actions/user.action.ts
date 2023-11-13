"use server";
import dbConnect from "../mongooseConnect";
import UserModel from "@/models/User";
import User from "@/models/User";
import mongoose, { ObjectId } from "mongoose";

export async function newUser(user: FormData) {
  try {
    await dbConnect();

    // check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email: user.get("email") }, { username: user.get("username") }],
    });

    // create user if it doesn't exist
    if (!existingUser) {
      await UserModel.create({
        email: user.get("email"),
        password: user.get("password"),
        username: user.get("username"),
        businessStage: user.get("stage"),
        codingLevel: user.get("codingLevel"),
        businessType: user.get("interests"),
      });

      return { status: "success" };
    }

    return { status: "already exists" };
  } catch (error) {
    return { status: "error" };
  }
}

export async function getUserProfile(email: string | null | undefined) {
  try {
    await dbConnect();

    const loggedInUser = await UserModel.findOne({ email });

    if (loggedInUser) {
      const userObj = {
        id: loggedInUser._id.toString(),
        name: loggedInUser.username,
        email: loggedInUser.email,
        profileImage: loggedInUser.profileImage,
        job: loggedInUser.occupation,
        followers: loggedInUser.followers,
        following: loggedInUser.following,
        points: loggedInUser.points,
        bio: loggedInUser.bio,
      };
      return userObj;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function followAuthor({
  userId,
  currentUserId,
  hasFollowed,
}: {
  userId: ObjectId;
  currentUserId: ObjectId;
  hasFollowed: boolean;
}) {
  try {
    dbConnect();
    let updateQuery = {};
    if (hasFollowed) {
      updateQuery = { $pull: { followers: currentUserId } };
    } else {
      updateQuery = { $addToSet: { followers: currentUserId } };
    }

    const user = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });
    const followedStatus = user?.followers.includes(currentUserId);
    if (!user) {
      throw new Error("User not found");
    }
    return { status: followedStatus };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
