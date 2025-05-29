import Link from "next/link";
import React from "react";
import UserDrawdown from "./UserDrawdown";
import Image from "next/image";
import { auth } from "@/utils/auth";
import { Button } from "../ui/button";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Image 
                            src="/logo.svg" 
                            alt="NextVocab Logo" 
                            width={32} 
                            height={32}
                            className="dark:invert"
                        />
                        <span className="font-bold">NextVocab</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/words" className="text-sm font-medium transition-colors hover:text-primary">
                            单词库
                        </Link>
                        <Link href="/plan" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            学习计划
                        </Link>
                        <Link href="/stats" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            学习统计
                        </Link>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    {session?.user ? (
                        <UserDrawdown user={session.user} />
                    ) : (
                        <Button asChild variant="default">
                            <Link href="/login">登录</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}