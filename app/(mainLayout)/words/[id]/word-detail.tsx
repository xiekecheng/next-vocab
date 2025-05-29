"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Word, UserWord, LearningStatus } from "@prisma/client";
import { updateWordStatus } from "@/lib/actions";

interface WordDetailProps {
  word: Word;
  userWord: UserWord | undefined;
  prevWord: { id: string; text: string } | null;
  nextWord: { id: string; text: string } | null;
}

export default function WordDetail({ word, userWord, prevWord, nextWord }: WordDetailProps) {
  const router = useRouter();
  const [note, setNote] = useState(userWord?.note || "");
  const [tags, setTags] = useState<string[]>(userWord?.tags || []);
  const [customMeaning, setCustomMeaning] = useState(userWord?.customMeaning || "");
  const [newTag, setNewTag] = useState("");

  const handleStatusChange = async (status: LearningStatus) => {
    await updateWordStatus(word.id, status);
    router.refresh();
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="container py-8">
      <div className="grid gap-6">
        {/* 导航按钮 */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={!prevWord}
            onClick={() => prevWord && router.push(`/words/${prevWord.id}`)}
          >
            上一个: {prevWord?.text || "无"}
          </Button>
          <Button
            variant="outline"
            disabled={!nextWord}
            onClick={() => nextWord && router.push(`/words/${nextWord.id}`)}
          >
            下一个: {nextWord?.text || "无"}
          </Button>
        </div>

        {/* 单词卡片 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{word.text}</h1>
              {word.phonetic && (
                <p className="text-muted-foreground">{word.phonetic}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant={userWord?.status === "NEW" ? "default" : "outline"}
                onClick={() => handleStatusChange("NEW")}
              >
                未学
              </Button>
              <Button
                variant={userWord?.status === "LEARNED" ? "default" : "outline"}
                onClick={() => handleStatusChange("LEARNED")}
              >
                已背
              </Button>
              <Button
                variant={userWord?.status === "FAMILIAR" ? "default" : "outline"}
                onClick={() => handleStatusChange("FAMILIAR")}
              >
                熟悉
              </Button>
            </div>
          </div>

          <Tabs defaultValue="meaning">
            <TabsList>
              <TabsTrigger value="meaning">释义</TabsTrigger>
              <TabsTrigger value="examples">例句</TabsTrigger>
              <TabsTrigger value="note">笔记</TabsTrigger>
            </TabsList>

            <TabsContent value="meaning" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">标准释义</h3>
                <p>{word.meaning}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">自定义释义</h3>
                <Textarea
                  value={customMeaning}
                  onChange={(e) => setCustomMeaning(e.target.value)}
                  placeholder="添加你的自定义释义..."
                />
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              {word.examples.map((example, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <p>{example}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="note" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">笔记</h3>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="添加你的笔记..."
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">标签</h3>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="添加新标签..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag}>添加</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
} 