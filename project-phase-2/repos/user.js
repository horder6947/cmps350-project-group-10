import prisma from "@/repos/prisma";

export async function newUser(p_username, p_email, p_password) {
    try {
        const result = await prisma.user.create({
            data: {
                username: p_username,
                email: p_email,
                password: p_password,
            },
            select: {
                id: true,
            }
        })
        return result.id;
    } catch (e) { console.error(e); }
}

export async function getUser(p_userid) {
    try {
        const result = await prisma.user.findUnique({
            where: {
                id: p_userid,
            },
            select: {
                id: true,
                username: true,
                bio: true,
                date_created: true,
            }
        });
        return result;
    } catch (e) { console.error(e); }
}

export async function getUserCount() {
    return (await prisma.user.aggregate({
        _count: true,
    }))._count;
}

export async function changeBio(p_userid, p_newBio) {
    try {
        const result = await prisma.user.update({
            where: {
                id: p_userid,
            },
            data: {
                bio: p_newBio,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}

export async function changeUsername(p_userid, p_newUsername) {
    try {
        const result = await prisma.user.update({
            where: {
                id: p_userid,
            },
            data: {
                username: p_newUsername,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}

export async function changeEmail(p_userid, p_newEmail) {
    try {
        const result = await prisma.user.update({
            where: {
                id: p_userid,
            },
            data: {
                email: p_newEmail,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}

export async function changePassword(p_userid, p_oldPassword, p_newPassword) {
    try {
        const myUser = await prisma.user.findUnique({
            where: {
                id: p_userid,
                password: p_oldPassword,
            }
        });

        if (!myUser)
            return false;

        const result = await prisma.user.update({
            where: {
                id: p_userid,
            },
            data: {
                password: p_newPassword,
            }
        });
        return true;
    } catch (e) { console.error(e); return false; }
}

export async function deleteUser(p_userid) {
    try {
        const result = await prisma.user.delete({
            where: {
                id: p_userid,
            },
        });
        return true;
    } catch (e) { console.error(e); return false; }
}