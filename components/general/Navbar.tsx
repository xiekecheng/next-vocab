import Link from "next/link";
import React from "react";
import UserDrawdown from "./UserDrawdown";
import Image from "next/image";
import { auth } from "@/utils/auth";
import { Button } from "../ui/button";

export default async function Navbar() {
    const session = await auth();
    console.log(session);

    return (
        <div className="bg-red-500 h-16 w-full flex items-center justify-between px-6">

            <Link href="/">
                <div className="flex items-center gap-2">
                    <Image src="/next.svg" alt="logo" width={32} height={32} />
                </div>
            </Link>
            <div className="flex items-center gap-2">
                {
                    session?.user ? (
                        <UserDrawdown user={session.user} />
                    ) : (
                        <Button asChild >
                            <Link href="/login">Login</Link>
                        </Button>
                    )
                }
            </div>
        </div>
    );
}