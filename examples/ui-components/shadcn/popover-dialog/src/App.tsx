import { ChatTrigger } from "@/components/ui/chatTrigger.tsx";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Moon, Sun, Monitor } from "lucide-react";
import { conversation } from "@/data/history";
import { models } from "@/data/models";
import { AiChat } from "@nlux/react";
import "@nlux/themes/nova.css";
import "./App.css";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "./components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";

export function App() {
  const { setTheme, theme } = useTheme();
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [mode, setMode] = useState<"drawer" | "popover" | "dialog">("drawer");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const chatComponent = (
    <AiChat
      className="nlux-AiChat-style"
      adapter={models[selectedModelIndex].adapter()}
      initialConversation={conversation.chat}
      displayOptions={{ colorScheme: theme }}
      personaOptions={conversation.personas}
    />
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex   flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a
              href="/Users/salmen/Projects/nx/demos/ui-components/chatgpt-ui/public"
              className="flex items-center gap-2 font-semibold"
            >
              <Avatar className="rounded-none w-6 h-6">
                <AvatarImage src={"./nlux.png"} />
                <AvatarFallback>Nlux</AvatarFallback>
              </Avatar>
              <span>Your AI Assistant</span>
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <form>
              <div className="relative flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    id="model"
                    className="flex gap-3 border items-start p-2 rounded-sm"
                  >
                    <img
                      src={models[selectedModelIndex].icon}
                      className="w-6 h-6 object-scale-down"
                    />
                    {models[selectedModelIndex].modelName}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {models.map((val, index) => (
                      <DropdownMenuItem
                        key={`models-${val.modelName}`}
                        className="z-[999989]"
                        onClick={() => setSelectedModelIndex(index)}
                      >
                        <div className="flex items-center gap-3 text-muted-foreground cursor-pointer z-auto">
                          <img
                            src={val.icon}
                            className="w-6 h-6 object-scale-down"
                          />
                          <div className="grid gap-0.5">
                            <span className="flex gap-1 items-center">
                              <p className=" font-medium text-foreground">
                                {val.modelName}
                              </p>
                              {index === selectedModelIndex && <Check />}
                            </span>
                            <p className="text-xs">{val.description}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="h-[1.2rem] w-[1.2rem] mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="h-[1.2rem] w-[1.2rem] mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("auto")}>
                <Monitor className="h-[1.2rem] w-[1.2rem] mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="relative flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex flex-col gap-4">
            <p>
              How would you like to display the chat interface?
              <br />
              Choose from the following options:
            </p>
            <RadioGroup
              className="flex gap-4"
              value={mode}
              onValueChange={(newValue) =>
                setMode(newValue as "drawer" | "popover" | "dialog")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="drawer" id="r2" />
                <Label htmlFor="r2" className="font-semibold cursor-pointer">
                  Drawer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="popover" id="r1" />
                <Label htmlFor="r1" className="font-semibold cursor-pointer">
                  Popover
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dialog" id="r3" />
                <Label htmlFor="r3" className="font-semibold cursor-pointer">
                  Dialog
                </Label>
              </div>
            </RadioGroup>
            <p>Click the button to open the chat interface.</p>
          </div>
          {mode === "popover" && (
            <div className="absolute bottom-3 right-6">
              <Popover
                open={isChatOpen && mode === "popover"}
                onOpenChange={() => setIsChatOpen(false)}
              >
                <PopoverAnchor>
                  <ChatTrigger
                    pos="bottom"
                    mode="popover"
                    isChatOpen={isChatOpen}
                    setIsChatOpen={setIsChatOpen}
                  />
                </PopoverAnchor>
                <PopoverContent
                  align="end"
                  side="bottom"
                  className="w-96 h-[60vh]"
                >
                  {chatComponent}
                </PopoverContent>
              </Popover>
            </div>
          )}
          {mode === "drawer" && (
            <Sheet onOpenChange={(open) => !open && setIsChatOpen(false)}>
              <SheetTrigger>
                <ChatTrigger
                  pos="center"
                  mode="drawer"
                  isChatOpen={isChatOpen}
                  setIsChatOpen={setIsChatOpen}
                />
              </SheetTrigger>
              <SheetContent>
                <div className="pt-4 w-full h-full">{chatComponent}</div>
              </SheetContent>
            </Sheet>
          )}
          {mode === "dialog" && (
            <Dialog
              open={isChatOpen && mode === "dialog"}
              onOpenChange={(open) => !open && setIsChatOpen(false)}
            >
              <DialogTrigger>
                <ChatTrigger
                  pos="center"
                  mode="dialog"
                  isChatOpen={isChatOpen}
                  setIsChatOpen={setIsChatOpen}
                />
              </DialogTrigger>
              <DialogContent>{chatComponent}</DialogContent>
            </Dialog>
          )}
          <div>
            <br/>
            Demo source code available on{' '}
            <a
                href="https://github.com/nlkitai/nlux/tree/latest/examples/ui-components/shadcn/popover-dialog"
                target="_blank"
                className="underline text-foreground"
            >
              <span className="font-bold">NLUX GitHub repo</span>
            </a>.
            <br/>
            Contributor:{' '}
            <a
                href="https://github.com/somebodyawesome-dev"
                target="_blank"
                className="underline text-foreground"
            >github.com/somebodyawesome-dev</a>.
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
