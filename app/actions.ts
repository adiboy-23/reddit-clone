"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { requestToBodyStream } from "next/dist/server/body-streams";
import { redirect } from "next/navigation";
import prisma from "./libs/db";
import { Prisma } from "@prisma/client";

export async function updateUsername( prevState : any ,formData : FormData ){
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if(!user){
        return redirect('/api/auth/login')
    }
    const username = formData.get('username') as string;
    try {
        await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            username: username,
        },
        });

        return {
        message: "Succesfully Updated username",
        status: "green",
        };
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
            return {
            message: "Username already in use",
            status: "error",
            };
        }
        }

        throw e;
    }
}