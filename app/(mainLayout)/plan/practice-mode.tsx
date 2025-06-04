"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordCard } from "../words/word-card";
import { completeWord } from "./actions";
import { useSession } from "next-auth/react";
import { auth } from "@/lib/auth";

interface Word {
  id: string;
  text: string;
  meaning: string;
  status: string;
}

interface PracticeModeProps {
  words: Word[];
  planId: string;
}

export default function PracticeMode({ words, planId }: PracticeModeProps) {
  // const session = await auth();
  const { data: session } = useSession()


  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const currentWord = words[currentWordIndex];

  const handleNext = async () => {
    if (session?.user?.id && currentWord) {
      await completeWord(currentWord.id, session.user.id, planId);
    }
    
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowMeaning(false);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowMeaning(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">练习模式</h2>
          <div className="text-sm text-muted-foreground">
            {currentWordIndex + 1} / {words.length}
          </div>
        </div>

        <Tabs defaultValue="recognition" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recognition">认识模式</TabsTrigger>
            <TabsTrigger value="recall">回忆模式</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recognition" className="space-y-4">
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold">{currentWord?.text}</h3>
                {showMeaning ? (
                  <p className="text-xl">{currentWord?.meaning}</p>
                ) : (
                  <Button onClick={() => setShowMeaning(true)}>
                    显示释义
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recall" className="space-y-4">
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold">{currentWord?.meaning}</h3>
                {showMeaning ? (
                  <p className="text-xl">{currentWord?.text}</p>
                ) : (
                  <Button onClick={() => setShowMeaning(true)}>
                    显示单词
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentWordIndex === 0}
          >
            上一个
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentWordIndex === words.length - 1}
          >
            下一个
          </Button>
        </div>
      </div>
    </Card>
  );
} 