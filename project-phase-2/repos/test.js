import prisma from "@/repos/prisma";
import * as follow from "@/repos/follow";
import * as user from "@/repos/user";

console.log(await follow.getFollowingCount("ahqy04ubiue80ba1a6fce72j"));