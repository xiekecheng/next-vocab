"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Word, LearningStatus } from "@prisma/client";
import Link from "next/link";
import { updateWordStatus } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Volume2 } from "lucide-react";

interface WordCardProps {
  word: Word & {
    status?: LearningStatus;
  };
}

export function WordCard({ word }: WordCardProps) {
  const router = useRouter();

  const handleStatusChange = async (status: LearningStatus) => {
    await updateWordStatus(word.id, status);
    router.refresh();
  };

  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // 设置语音参数
      utterance.lang = "en-US"; // 英语
      utterance.rate = 0.8; // 语速稍慢
      utterance.pitch = 1; // 音调
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="border rounded p-4 flex flex-col gap-2 bg-white shadow-sm relative">
      <div className="absolute top-2 right-2 flex gap-1">
        <Badge variant="outline">{word.frequency}</Badge>
        <Button
          variant={word.status === "LEARNED" ? "default" : "outline"}
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            handleStatusChange("LEARNED");
          }}
        >
          已背
        </Button>
        <Button
          variant={word.status === "FAMILIAR" ? "default" : "outline"}
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            handleStatusChange("FAMILIAR");
          }}
        >
          熟悉
        </Button>
      </div>
      <Link href={`/words/${word.id}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{word.text}</span>
            {word.phonetic && (
              <span className="text-sm text-gray-500">[{word.phonetic}]</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                speakWord(word.text);
              }}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-700">{word.meaning}</div>

          {/* 添加例句展示区域 */}
          {word.examples && word.examples.length > 0 && (
            <div className="mt-2 space-y-2">
              <div className="text-sm font-medium text-gray-500">例句：</div>
              <div className="space-y-2">
                {word.examples.map((example, index) => {
                  return (
                    <div key={index} className="text-sm">
                      <p className="text-gray-800">
                        {index + 1}. {example}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
