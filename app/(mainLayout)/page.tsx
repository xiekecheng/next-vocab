import React from "react";
import { prisma } from "@/utils/prisma";

async function getWords() {
  const words = await prisma.word.findMany()
  return words
}

export default async function Home() {
  const words = await getWords()
  console.log(words)
  return <div>Home</div>;
}