import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./input";
import { X } from "lucide-react";
import { IconSend } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat-messsage";
import { useState } from "react";
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}
export function ChatDrawer({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your Tantei assistant. I can help you discover trading agents, understand platform features, or answer any questions you have about crypto trading.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm a demo response. In the real implementation, I'll be connected to an AI model to provide actual assistance and agent recommendations.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row  items-center justify-between">
          <div className="space-y-1">
            <DrawerTitle className="font-semibold text-xl">
              Tantei Assistant
            </DrawerTitle>
            <DrawerDescription>Chat with our bot.</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button
              size="icon"
              variant="outline"
              className="hover:text-red-800 text-black hover:bg-gray-50 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <ScrollArea className="flex-1 p-4 min-h-96 overflow-y-auto  ">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onKeyDown={handleKeyPress}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend}>
              <IconSend className="h-4 w-4" />
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
