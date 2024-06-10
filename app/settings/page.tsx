import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../libs/db"
import { redirect } from "next/navigation";
import { SettingsForm } from "../components/SettingsForm";

async function getData(userId : string){
    const data = await prisma.user.findUnique({
        where : {
            id : userId,
        },
        select : {
            username : true,
        }
    })
    return data
}

export default async function SettingPage(){
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if(!user) {
        return redirect('/api/auth/login')
    }
    const data = await getData(user.id); 
    return(
        <div className='max-w-[1000px] mx-auto flex flex-col mt-4'>
            <SettingsForm username={data?.username}/>
        </div>
    )
}