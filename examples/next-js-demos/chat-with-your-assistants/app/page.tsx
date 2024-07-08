"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Conversation, conversationsHistory } from "@/data/history";

import {
  AiChat,
  EventsConfig,
  MessageReceivedCallback,
  MessageSentCallback,
} from "@nlux/react";
import "@nlux/themes/nova.css";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { GithubIcon } from "@/components/github-icon";
import { Input } from "@/components/ui/input";
import { produce } from "immer";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { LastMessageSummary } from "@/components/last-message-summary";
import {
  getConversationLastTimestamp,
  parsedToObjects,
  sortConversationsByLastMessageDate,
} from "@/lib/conversations";
import { ThemeToggle } from "@/components/theme-toggle";
import { SimpleAvatar } from "@/components/simple-avatar";
import { UserSettingsForm } from "@/components/user-settings";
import useLocalStorage from "@/lib/localstorage";
import { openAiAdapter } from "@/adapter/openai";

const initialData = {
  conversations: conversationsHistory,
  imageUrl: "https://github.com/nlkitai.png",
};
function App() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [currentConversationId, setCurrentConversationId] =
    useState<string>("");

  const [storage, setStorage] = useLocalStorage({
    key: "chat_app", // TODO: Change name
    defaultValue: initialData,
  });
  const [conversations, setConversations] = useState<Conversation[]>(() => []);
  const [userImgUrl, setUserImgUrl] = useState<string>("");

  useEffect(() => {
    // To prevent mismatch with pre-render, first show no conversations and then load them
    setConversations(parsedToObjects(storage.conversations));
    setUserImgUrl(storage.imageUrl);
  }, []);

  // Persist conversations to local storage with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setStorage({
        conversations: conversations,
        imageUrl: userImgUrl,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [conversations, userImgUrl]);

  const userName = useMemo(
    () => conversations[0]?.personas.user?.name,
    [conversations]
  );

  // Sort conversations by last message date
  const sortedConversations = useMemo(
    () => sortConversationsByLastMessageDate(conversations),
    [conversations]
  );

  const currentConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === currentConversationId
      ),
    [conversations, currentConversationId]
  );

  const filteredConversations = useMemo(
    () =>
      sortedConversations.filter((conversation) =>
        conversation.personas.assistant?.name
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [sortedConversations, query]
  );

  const finalConversations = filteredConversations;

  const messageReceivedCallback = useCallback<
    MessageReceivedCallback<string[]>
  >(
    (eventDetails) => {
      setConversations(
        produce((draft) => {
          const conversation = draft.find(
            (conversation) => conversation.id === currentConversationId
          );
          if (conversation) {
            conversation.chat?.push({
              message: eventDetails.message.join(""),
              timestamp: new Date(),
              role: "assistant",
            });
          }
        })
      );
    },
    [currentConversationId, conversations, setConversations]
  );

  const messageSentCallback = useCallback<MessageSentCallback>(
    (eventDetails) => {
      setConversations(
        produce((draft) => {
          const conversation = draft.find(
            (conversation) => conversation.id === currentConversationId
          );
          if (conversation) {
            conversation.chat?.push({
              message: eventDetails.message,
              timestamp: new Date(),
              role: "user",
            });
          }
        })
      );
    },
    [currentConversationId, conversations, setConversations]
  );

  const initialConversation = useMemo(() => {
    const chatClone = currentConversation?.chat?.slice() || [];
    return chatClone;
  }, [currentConversationId]);

  const eventCallbacks: EventsConfig = {
    // @ts-expect-error lib type error
    messageReceived: messageReceivedCallback,
    messageSent: messageSentCallback,
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[300px_1fr]">
      <div className="border-r bg-muted/40">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-16 bg-muted items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger>
                <SimpleAvatar avatar={userImgUrl} name={userName || ""} />
              </SheetTrigger>
              <SheetContent side={"left"} className="w-[300px]">
                <SheetHeader className="gap-4">
                  <SheetTitle>User Settings</SheetTitle>
                  <SheetDescription>
                    <UserSettingsForm
                      initialUserName={userName || ""}
                      initialImageUrl={userImgUrl}
                      onSubmit={(data) => {
                        setUserImgUrl(data.image_url);
                        // Update user name in conversations
                        setConversations(
                          produce((draft) => {
                            draft.forEach((conversation) => {
                              if (conversation && conversation.personas.user) {
                                conversation.personas.user.name = data.username;
                              }
                            });
                          })
                        );
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              onClick={() => {
                setCurrentConversationId("");
              }}
            >
              <h1 className="text-xl">Chat App</h1>
            </Button>
          </div>
          {/* Height is calculated as screen height - header - footer */}
          <ScrollArea className="flex-1 w-full h-[calc(100vh-64px-64px)]">
            <div className="relative m-2 mr-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            </div>
            <nav className="grid items-start text-sm font-medium ">
              {finalConversations.map((conversation, index) => (
                <div key={conversation.id}>
                  <a
                    key={`conversation-${conversation.id}`}
                    className={`${
                      conversation.id == currentConversationId
                        ? "!bg-secondary"
                        : "bg-transparent"
                    } flex items-center h-20 gap-3 px-3 py-2 transition-all hover:text-primary cursor-pointer hover:bg-secondary `}
                    onClick={() => setCurrentConversationId(conversation.id)}
                  >
                    <SimpleAvatar
                      avatar={conversation.personas.assistant?.avatar as string}
                      name={conversation.personas.assistant?.name as string}
                    />
                    <div className="flex flex-col w-full gap-0.5">
                      <div className="flex justify-between w-full items-center">
                        <h2 className="text-lg font-semibold">
                          {conversation.personas.assistant?.name}
                        </h2>
                        <p className="text-xs font-normal text-muted-foreground">
                          {formatDate(
                            getConversationLastTimestamp(conversation) as Date
                          )}
                        </p>
                      </div>
                      <LastMessageSummary
                        lastMessage={
                          conversation.chat?.findLast((item) => item.message)
                            ?.message || ""
                        }
                      ></LastMessageSummary>
                    </div>
                  </a>
                  <Separator key={"separator-" + conversation.id} />
                </div>
              ))}
            </nav>
          </ScrollArea>
          <div className="h-16 w-full px-4 bg-muted flex items-center gap-4 justify-between">
            {/* Github repo */}
            <a
              href="https://github.com/nlkitai/nlux"
              className="flex gap-2 items-center"
              target="_blank"
            >
              <Button variant="ghost" size={"icon"}>
                <GithubIcon className="h-6 w-6" />
              </Button>
              GitHub
            </a>
            <a
              href="http://www.freepik.com"
              className="text-xs text-muted-foreground"
            >
              Avatars by Freepik
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {currentConversation ? (
              <div className="relative flex gap-3 items-center">
                <SimpleAvatar
                  avatar={
                    currentConversation.personas.assistant?.avatar as string
                  }
                  name={currentConversation.personas.assistant?.name as string}
                />

                <div>
                  <h2 className="text-lg font-semibold">
                    {currentConversation.personas.assistant?.name}
                  </h2>
                  <p className="text-xs font-normal text-muted-foreground">
                    {currentConversation.personas.assistant?.tagline}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Link
              href="https://github.com/nlkitai/nlux"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              target="_blank"
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
            <ThemeToggle />
          </div>
        </header>
        {currentConversation ? (
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <AiChat
              key={currentConversation.id}
              className="nlux-AiChat-style"
              adapter={openAiAdapter()}
              composerOptions={{ placeholder: "How can I help you today?" }}
              initialConversation={initialConversation}
              displayOptions={{ colorScheme: theme }}
              personaOptions={currentConversation.personas}
              events={eventCallbacks}
            />
          </main>
        ) : (
          <div className="flex flex-col gap-3 flex-1 items-center justify-center ">
            <h3 className="text-3xl font-semibold">
              Chat with your assistants
            </h3>
            <p className="text-lg font-normal text-muted-foreground">
              This demo uses{' '}
              <a
                  href="https://docs.nlkit.com/nlux"
                  target="_blank"
                  className="underline text-foreground"
              >
                <span>NLUX</span>
              </a>
              , the conversational AI library.
              <br/>
              <br/>
              Source code available on:{' '}
              <a
                  href="https://github.com/nlkitai/nlux/tree/latest/examples/next-js-demos/chat-with-your-assistants"
                  target="_blank"
                  className="underline text-foreground"
              >
                <span className="font-bold">NLUX GitHub repo</span>
              </a>.
              <br/>
              Contributor:{' '}
              <a
                  href="https://github.com/FranciscoMoretti"
                  target="_blank"
                  className="underline text-foreground"
              >github.com/FranciscoMoretti</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
