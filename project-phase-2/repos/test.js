import prisma from "@/repos/prisma";
import * as follow from "@/repos/follow";
import * as user from "@/repos/user";
import * as post from "@/repos/post";
import * as comment from "@/repos/comment";
import * as like from "@/repos/like";
import * as stats from "@/repos/statistics";

console.log(await stats.getNewUsers());