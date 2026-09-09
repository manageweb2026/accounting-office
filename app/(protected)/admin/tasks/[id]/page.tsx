"use client";

import { useEffect, useState } from "react";

export default function TaskDetails({
    params,
}:{
    params: Promise<{id:string}>
}){

    const [task,setTask]=useState<any>(null);

    useEffect(()=>{

        async function load(){

            const {id}=await params;

            const res=await fetch(`/api/tasks/${id}`,{
                credentials:"include",
            });

            const data=await res.json();

            if(data.success){
                setTask(data.task);
            }

        }

        load();

    },[params]);

    if(!task){
        return <div>Loading...</div>;
    }

    return(

        <div className="p-6">

        </div>

    );

}