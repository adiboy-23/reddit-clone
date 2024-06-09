import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/libs/db";
import { generateUsername } from "unique-username-generator";
import { NextResponse } from "next/server";

export async function GET(){
    const { getUser } = getKindeServerSession();
    const user = await getUser()
    if( !user || user === null || !user.id) throw new Error("Something went wrong , please try again!");
    let dbUser = await prisma.user.findUnique({
        where: {
            id : user.id
        },
    });
    if(!dbUser){
        dbUser = await prisma.user.create({
            data : {
                id : user.id,
                email : user.email ?? "",
                firstname : user.given_name ?? "",
                lastname : user.family_name ?? "",
                imageUrl : user.picture,
                username : generateUsername("",4,15),
            },
        });
    }
    return NextResponse.redirect("https://localhost:3000/")
}