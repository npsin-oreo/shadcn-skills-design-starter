import type { ReactNode } from "react";
import { Bell, Bold, Italic, Search, Slash, Star, Underline } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger,
} from "@/components/ui/menubar";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  ChartDemo,
  ComboboxDemo,
  DataTableDemo,
  DatePickerDemo,
  InputOTPDemo,
  SidebarDemo,
  SonnerDemo,
} from "@/components/docs/demos";
import { DemoItem, DemoSection, DemoShowcase } from "@/components/docs/demo";
import { ColorsReference } from "@/components/docs/references/colors-reference";
import { IconLibrary } from "@/components/docs/references/icon-library";
import { RadiusReference } from "@/components/docs/references/radius-reference";
import { SpacingReference } from "@/components/docs/references/spacing-reference";
import { TypographyReference } from "@/components/docs/references/typography-reference";

export type DocCategory =
  | "Form & Input"
  | "Display"
  | "Navigation"
  | "Overlay"
  | "Data"
  | "Feedback"
  | "Utility"
  | "Foundations"
  | "Design Tokens";

export type DocEntry = {
  slug: string;
  title: string;
  description: string;
  category: DocCategory;
  demo: ReactNode;
  code: string;
  reference?: boolean;
};

export const CATEGORY_ORDER: DocCategory[] = [
  "Form & Input",
  "Display",
  "Navigation",
  "Overlay",
  "Data",
  "Feedback",
  "Utility",
  "Foundations",
  "Design Tokens",
];

const c = (slug: string, title: string, category: DocCategory, description: string, demo: ReactNode, code: string): DocEntry =>
  ({ slug, title, category, description, demo, code });

export const registry: DocEntry[] = [
  // ───────────────────────── Form & Input ─────────────────────────
  c("button", "Button", "Form & Input", "Displays a button or a component that looks like a button.",
    <DemoShowcase>
      <DemoSection label="Variants">
        <DemoItem caption="default"><Button>Primary</Button></DemoItem>
        <DemoItem caption="secondary"><Button variant="secondary">Secondary</Button></DemoItem>
        <DemoItem caption="outline"><Button variant="outline">Outline</Button></DemoItem>
        <DemoItem caption="ghost"><Button variant="ghost">Ghost</Button></DemoItem>
        <DemoItem caption="destructive"><Button variant="destructive">Destructive</Button></DemoItem>
        <DemoItem caption="link"><Button variant="link">Link</Button></DemoItem>
      </DemoSection>
      <DemoSection label="Sizes">
        <DemoItem caption="sm"><Button size="sm">Small</Button></DemoItem>
        <DemoItem caption="md"><Button size="md">Medium</Button></DemoItem>
        <DemoItem caption="xl"><Button size="xl">Extra Large</Button></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="xl">Extra Large</Button>`),

  c("button-group", "Button Group", "Form & Input", "Groups related buttons together. Size is driven by the buttons inside the group.",
    <DemoShowcase>
      <DemoSection label="Default">
        <DemoItem><ButtonGroup>
          <Button variant="outline">Years</Button><Button variant="outline">Months</Button><Button variant="outline">Days</Button>
        </ButtonGroup></DemoItem>
      </DemoSection>
      <DemoSection label="Small">
        <DemoItem caption="size=sm"><ButtonGroup>
          <Button size="sm" variant="outline">Years</Button><Button size="sm" variant="outline">Months</Button><Button size="sm" variant="outline">Days</Button>
        </ButtonGroup></DemoItem>
      </DemoSection>
      <DemoSection label="Large">
        <DemoItem caption="size=lg"><ButtonGroup>
          <Button size="lg" variant="outline">Years</Button><Button size="lg" variant="outline">Months</Button><Button size="lg" variant="outline">Days</Button>
        </ButtonGroup></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<ButtonGroup>\n  <Button size="sm" variant="outline">Years</Button>\n  <Button size="sm" variant="outline">Months</Button>\n</ButtonGroup>\n\n<ButtonGroup>\n  <Button size="lg" variant="outline">Years</Button>\n  <Button size="lg" variant="outline">Months</Button>\n</ButtonGroup>`),

  c("checkbox", "Checkbox", "Form & Input", "A control that toggles between checked and unchecked.",
    <DemoShowcase>
      <DemoSection label="Default">
        <DemoItem className="flex-row items-center gap-2">
          <Checkbox id="terms" defaultChecked /><Label htmlFor="terms">Accept terms and conditions</Label>
        </DemoItem>
      </DemoSection>
      <DemoSection label="Card">
        <DemoItem>
          <Label
            htmlFor="card-notify"
            className="flex items-start gap-3 rounded-lg border border-input p-4 has-data-checked:border-primary has-data-checked:bg-primary/5"
          >
            <Checkbox id="card-notify" defaultChecked className="mt-0.5" />
            <div className="grid gap-1 font-normal">
              <p className="text-sm font-medium leading-none">Enable notifications</p>
              <p className="text-sm text-muted-foreground">Send me product updates and news.</p>
            </div>
          </Label>
        </DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `// Card checkbox\n<Label className="flex items-start gap-3 rounded-lg border p-4 has-data-checked:border-primary has-data-checked:bg-primary/5">\n  <Checkbox defaultChecked />\n  <div className="grid gap-1">\n    <p className="text-sm font-medium">Enable notifications</p>\n    <p className="text-sm text-muted-foreground">Send me product updates.</p>\n  </div>\n</Label>`),

  c("field", "Field", "Form & Input", "A labelled form field with description.",
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="fname">Name</FieldLabel>
        <Input id="fname" placeholder="Evil Rabbit" />
        <FieldDescription>This is your public display name.</FieldDescription>
      </Field>
    </FieldGroup>,
    `<Field>\n  <FieldLabel htmlFor="fname">Name</FieldLabel>\n  <Input id="fname" />\n  <FieldDescription>...</FieldDescription>\n</Field>`),

  c("input", "Input", "Form & Input", "A form input field with a matching label.",
    <DemoShowcase>
      <DemoSection label="With label">
        <DemoItem className="w-full max-w-sm items-stretch">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
        </DemoItem>
      </DemoSection>
      <DemoSection label="Sizes">
        <DemoItem caption="sm" className="w-full max-w-sm items-stretch"><Input size="sm" placeholder="Small" /></DemoItem>
        <DemoItem caption="md" className="w-full max-w-sm items-stretch"><Input size="md" placeholder="Medium (default)" /></DemoItem>
        <DemoItem caption="xl" className="w-full max-w-sm items-stretch"><Input size="xl" placeholder="Extra large" /></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Input size="sm" placeholder="Small" />\n<Input size="md" placeholder="Medium (default)" />\n<Input size="xl" placeholder="Extra large" />`),

  c("input-group", "Input Group", "Form & Input", "An input with leading or trailing addons.",
    <InputGroup className="w-full max-w-sm">
      <InputGroupAddon><Search className="size-4" /></InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>,
    `<InputGroup>\n  <InputGroupAddon><Search /></InputGroupAddon>\n  <InputGroupInput placeholder="Search..." />\n</InputGroup>`),

  c("input-otp", "Input OTP", "Form & Input", "Accessible one-time-password input.",
    <InputOTPDemo />,
    `const [value, setValue] = React.useState("123456")\n\n<InputOTP maxLength={6} value={value} onChange={setValue}>\n  <InputOTPGroup>\n    <InputOTPSlot index={0} />\n    <InputOTPSlot index={1} />\n    <InputOTPSlot index={2} />\n    <InputOTPSlot index={3} />\n    <InputOTPSlot index={4} />\n    <InputOTPSlot index={5} />\n  </InputOTPGroup>\n</InputOTP>`),

  c("label", "Label", "Form & Input", "An accessible label associated with a control.",
    <div className="flex items-center gap-2">
      <Checkbox id="news" /><Label htmlFor="news">Subscribe to newsletter</Label>
    </div>,
    `<Label htmlFor="news">Subscribe</Label>`),

  c("native-select", "Native Select", "Form & Input", "A styled native HTML select element.",
    <NativeSelect className="w-full max-w-sm" defaultValue="next">
      <NativeSelectOption value="next">Next.js</NativeSelectOption>
      <NativeSelectOption value="remix">Remix</NativeSelectOption>
      <NativeSelectOption value="astro">Astro</NativeSelectOption>
    </NativeSelect>,
    `<NativeSelect>\n  <NativeSelectOption value="next">Next.js</NativeSelectOption>\n</NativeSelect>`),

  c("combobox", "Combobox", "Form & Input", "An autocomplete input + command palette — Popover composed with Command.",
    <ComboboxDemo />,
    `// Combobox = Popover + Command\n<Popover open={open} onOpenChange={setOpen}>\n  <PopoverTrigger asChild><Button variant="outline" role="combobox">{label}</Button></PopoverTrigger>\n  <PopoverContent><Command><CommandInput /><CommandList>...</CommandList></Command></PopoverContent>\n</Popover>`),

  c("radio-group", "Radio Group", "Form & Input", "A set of checkable buttons where only one can be selected.",
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <div className="flex items-center gap-2"><RadioGroupItem value="default" id="r1" /><Label htmlFor="r1">Default</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="comfortable" id="r2" /><Label htmlFor="r2">Comfortable</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="compact" id="r3" /><Label htmlFor="r3">Compact</Label></div>
    </RadioGroup>,
    `<RadioGroup defaultValue="comfortable">\n  <RadioGroupItem value="default" id="r1" />\n</RadioGroup>`),

  c("select", "Select", "Form & Input", "Displays a list of options to pick from, triggered by a button.",
    <DemoShowcase>
      <DemoSection label="Sizes">
        {(["sm", "md", "xl"] as const).map((s) => (
          <DemoItem key={s} caption={s}>
            <Select>
              <SelectTrigger size={s} className="w-[200px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem><SelectItem value="system">System</SelectItem></SelectContent>
            </Select>
          </DemoItem>
        ))}
      </DemoSection>
    </DemoShowcase>,
    `<SelectTrigger size="sm">…</SelectTrigger>\n<SelectTrigger size="md">…</SelectTrigger>\n<SelectTrigger size="xl">…</SelectTrigger>`),

  c("slider", "Slider", "Form & Input", "An input for selecting a value from a range.",
    <Slider defaultValue={[50]} max={100} step={1} className="w-full max-w-sm" />,
    `<Slider defaultValue={[50]} max={100} step={1} />`),

  c("switch", "Switch", "Form & Input", "A control that toggles between on and off.",
    <div className="flex items-center gap-2"><Switch id="airplane" /><Label htmlFor="airplane">Airplane Mode</Label></div>,
    `<Switch id="airplane" />\n<Label htmlFor="airplane">Airplane Mode</Label>`),

  c("textarea", "Textarea", "Form & Input", "A multi-line text input field.",
    <DemoShowcase>
      <DemoSection label="With label">
        <DemoItem className="w-full max-w-sm items-stretch">
          <div className="grid gap-2"><Label htmlFor="msg">Message</Label><Textarea id="msg" placeholder="Type your message here." /></div>
        </DemoItem>
      </DemoSection>
      <DemoSection label="Sizes">
        <DemoItem caption="sm" className="w-full max-w-sm items-stretch"><Textarea size="sm" placeholder="Small" /></DemoItem>
        <DemoItem caption="md" className="w-full max-w-sm items-stretch"><Textarea size="md" placeholder="Medium (default)" /></DemoItem>
        <DemoItem caption="xl" className="w-full max-w-sm items-stretch"><Textarea size="xl" placeholder="Extra large" /></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Textarea size="sm" placeholder="Small" />\n<Textarea size="md" placeholder="Medium (default)" />\n<Textarea size="xl" placeholder="Extra large" />`),

  c("toggle", "Toggle", "Form & Input", "A two-state button that can be on or off.",
    <DemoShowcase>
      <DemoSection label="Variants">
        <DemoItem caption="default"><Toggle aria-label="Bold"><Bold className="size-4" /></Toggle></DemoItem>
        <DemoItem caption="outline"><Toggle variant="outline" aria-label="Italic"><Italic className="size-4" /></Toggle></DemoItem>
      </DemoSection>
      <DemoSection label="Sizes">
        <DemoItem caption="sm"><Toggle size="sm" aria-label="Bold"><Bold className="size-4" /></Toggle></DemoItem>
        <DemoItem caption="default"><Toggle size="default" aria-label="Bold"><Bold className="size-4" /></Toggle></DemoItem>
        <DemoItem caption="lg"><Toggle size="lg" aria-label="Bold"><Bold className="size-4" /></Toggle></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Toggle aria-label="Bold"><Bold /></Toggle>\n<Toggle variant="outline" size="lg"><Italic /></Toggle>`),

  c("toggle-group", "Toggle Group", "Form & Input", "A set of two-state buttons that can be toggled.",
    <DemoShowcase>
      <DemoSection label="Variants">
        <DemoItem caption="default">
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="bold" aria-label="Bold"><Bold className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic"><Italic className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline"><Underline className="size-4" /></ToggleGroupItem>
          </ToggleGroup>
        </DemoItem>
        <DemoItem caption="outline">
          <ToggleGroup type="multiple" variant="outline">
            <ToggleGroupItem value="bold" aria-label="Bold"><Bold className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic"><Italic className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline"><Underline className="size-4" /></ToggleGroupItem>
          </ToggleGroup>
        </DemoItem>
      </DemoSection>
      <DemoSection label="Sizes">
        <DemoItem caption="sm">
          <ToggleGroup type="multiple" size="sm">
            <ToggleGroupItem value="bold" aria-label="Bold"><Bold className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic"><Italic className="size-4" /></ToggleGroupItem>
          </ToggleGroup>
        </DemoItem>
        <DemoItem caption="lg">
          <ToggleGroup type="multiple" size="lg">
            <ToggleGroupItem value="bold" aria-label="Bold"><Bold className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic"><Italic className="size-4" /></ToggleGroupItem>
          </ToggleGroup>
        </DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<ToggleGroup type="multiple" variant="outline" size="lg">\n  <ToggleGroupItem value="bold"><Bold /></ToggleGroupItem>\n</ToggleGroup>`),

  // ───────────────────────── Display ─────────────────────────
  c("avatar", "Avatar", "Display", "An image element with a fallback for representing a user.",
    <DemoShowcase>
      <DemoSection label="Sizes">
        <DemoItem caption="sm"><Avatar size="sm"><AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar></DemoItem>
        <DemoItem caption="default"><Avatar size="default"><AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar></DemoItem>
        <DemoItem caption="lg"><Avatar size="lg"><AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar></DemoItem>
      </DemoSection>
      <DemoSection label="Fallback">
        <DemoItem caption="initials"><Avatar><AvatarFallback>AB</AvatarFallback></Avatar></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Avatar size="lg">\n  <AvatarImage src="..." alt="@shadcn" />\n  <AvatarFallback>CN</AvatarFallback>\n</Avatar>`),

  c("badge", "Badge", "Display", "A small count or status descriptor.",
    <DemoShowcase>
      <DemoSection label="Variants">
        <DemoItem caption="default"><Badge>Default</Badge></DemoItem>
        <DemoItem caption="secondary"><Badge variant="secondary">Secondary</Badge></DemoItem>
        <DemoItem caption="destructive"><Badge variant="destructive">Destructive</Badge></DemoItem>
        <DemoItem caption="outline"><Badge variant="outline">Outline</Badge></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Badge>Default</Badge>\n<Badge variant="secondary">Secondary</Badge>`),

  c("card", "Card", "Display", "A container for content with a header, body, and footer.",
    <Card className="w-full max-w-sm">
      <CardHeader><CardTitle>Create project</CardTitle><CardDescription>Deploy in one click.</CardDescription></CardHeader>
      <CardContent><div className="grid gap-2"><Label htmlFor="cn">Name</Label><Input id="cn" placeholder="Project name" /></div></CardContent>
      <CardFooter className="flex justify-between gap-2"><Button variant="outline">Cancel</Button><Button>Deploy</Button></CardFooter>
    </Card>,
    `<Card>\n  <CardHeader><CardTitle>...</CardTitle></CardHeader>\n  <CardContent>...</CardContent>\n  <CardFooter>...</CardFooter>\n</Card>`),

  c("carousel", "Carousel", "Display", "A carousel with motion and swipe built using Embla.",
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {[1, 2, 3].map((i) => (
          <CarouselItem key={i}>
            <Card><CardContent className="flex aspect-square items-center justify-center p-6 text-4xl font-semibold">{i}</CardContent></Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious /><CarouselNext />
    </Carousel>,
    `<Carousel>\n  <CarouselContent>\n    <CarouselItem>...</CarouselItem>\n  </CarouselContent>\n  <CarouselPrevious /><CarouselNext />\n</Carousel>`),

  c("chart", "Chart", "Display", "Composable charts built on Recharts, themed with chart tokens.",
    <ChartDemo />,
    `const chartConfig = { desktop: { label: "Desktop", color: "var(--color-chart-1)" } }\n<ChartContainer config={chartConfig}>\n  <BarChart data={data}>...</BarChart>\n</ChartContainer>`),

  c("empty", "Empty", "Display", "An empty state placeholder.",
    <Empty className="w-full max-w-sm border">
      <EmptyHeader><EmptyTitle>No projects</EmptyTitle><EmptyDescription>Create your first project to get started.</EmptyDescription></EmptyHeader>
      <EmptyContent><Button size="sm">Create project</Button></EmptyContent>
    </Empty>,
    `<Empty>\n  <EmptyHeader><EmptyTitle>No projects</EmptyTitle></EmptyHeader>\n  <EmptyContent><Button>Create</Button></EmptyContent>\n</Empty>`),

  c("item", "Item", "Display", "A flexible row for lists and settings.",
    <Item className="w-full max-w-md border">
      <ItemContent><ItemTitle>Notifications</ItemTitle><ItemDescription>Manage how you receive alerts.</ItemDescription></ItemContent>
      <ItemActions><Button size="sm" variant="outline">Configure</Button></ItemActions>
    </Item>,
    `<Item>\n  <ItemContent><ItemTitle>...</ItemTitle><ItemDescription>...</ItemDescription></ItemContent>\n  <ItemActions><Button>Configure</Button></ItemActions>\n</Item>`),

  c("kbd", "Kbd", "Display", "Displays keyboard keys.",
    <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>,
    `<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>`),

  c("progress", "Progress", "Display", "Displays an indicator showing completion progress.",
    <DemoShowcase>
      <DemoSection label="Values">
        <DemoItem caption="25%" className="w-full max-w-sm items-stretch"><Progress value={25} /></DemoItem>
        <DemoItem caption="50%" className="w-full max-w-sm items-stretch"><Progress value={50} /></DemoItem>
        <DemoItem caption="75%" className="w-full max-w-sm items-stretch"><Progress value={75} /></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Progress value={25} />\n<Progress value={50} />\n<Progress value={75} />`),

  c("skeleton", "Skeleton", "Display", "A placeholder to show while content is loading.",
    <DemoShowcase>
      <DemoSection label="Shapes">
        <DemoItem caption="avatar + lines">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="space-y-2"><Skeleton className="h-4 w-[200px]" /><Skeleton className="h-4 w-[160px]" /></div>
          </div>
        </DemoItem>
        <DemoItem caption="card">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-28 w-[250px] rounded-lg" />
            <Skeleton className="h-4 w-[250px]" /><Skeleton className="h-4 w-[200px]" />
          </div>
        </DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Skeleton className="size-12 rounded-full" />\n<Skeleton className="h-4 w-[200px]" />`),

  c("spinner", "Spinner", "Display", "An animated loading indicator.",
    <DemoShowcase>
      <DemoSection label="Sizes">
        <DemoItem caption="size-4"><Spinner /></DemoItem>
        <DemoItem caption="size-6"><Spinner className="size-6" /></DemoItem>
        <DemoItem caption="size-8"><Spinner className="size-8" /></DemoItem>
      </DemoSection>
      <DemoSection label="Color">
        <DemoItem caption="currentColor"><Spinner /></DemoItem>
        <DemoItem caption="primary"><Spinner className="text-primary" /></DemoItem>
        <DemoItem caption="muted-foreground"><Spinner className="text-muted-foreground" /></DemoItem>
        <DemoItem caption="destructive"><Spinner className="text-destructive" /></DemoItem>
      </DemoSection>
      <DemoSection label="Loading button">
        <DemoItem caption="default"><Button disabled><Spinner />Loading…</Button></DemoItem>
        <DemoItem caption="outline"><Button variant="outline" disabled><Spinner />Loading…</Button></DemoItem>
        <DemoItem caption="secondary"><Button variant="secondary" disabled><Spinner />Loading…</Button></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `// Color follows the current text color — use a semantic token, never a raw hex\n<Spinner className="text-primary" />\n<Spinner className="text-muted-foreground" />\n<Spinner className="text-destructive" />\n\n// In a loading button — spinner inherits the button's foreground color\n<Button disabled><Spinner />Loading…</Button>\n<Button variant="outline" disabled><Spinner />Loading…</Button>\n<Button variant="secondary" disabled><Spinner />Loading…</Button>`),

  c("table", "Table", "Display", "A responsive table for tabular data.",
    <div className="mx-auto w-full max-w-2xl">
      <Table>
        <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
        <TableBody>
          <TableRow><TableCell className="font-medium">INV001</TableCell><TableCell><Badge>Paid</Badge></TableCell><TableCell className="text-right">$250.00</TableCell></TableRow>
          <TableRow><TableCell className="font-medium">INV002</TableCell><TableCell><Badge variant="secondary">Pending</Badge></TableCell><TableCell className="text-right">$150.00</TableCell></TableRow>
        </TableBody>
      </Table>
    </div>,
    `<Table>\n  <TableHeader>...</TableHeader>\n  <TableBody>...</TableBody>\n</Table>`),

  // ───────────────────────── Navigation ─────────────────────────
  c("breadcrumb", "Breadcrumb", "Navigation", "Displays the path to the current resource.",
    <DemoShowcase>
      <DemoSection label="Default">
        <DemoItem><Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb></DemoItem>
      </DemoSection>
      <DemoSection label="Custom separator">
        <DemoItem><Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
            <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb></DemoItem>
      </DemoSection>
      <DemoSection label="Dropdown">
        <DemoItem><Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1" aria-label="Toggle menu">
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Components</DropdownMenuItem>
                  <DropdownMenuItem>Themes</DropdownMenuItem>
                  <DropdownMenuItem>GitHub</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb></DemoItem>
      </DemoSection>
      <DemoSection label="Collapsed">
        <DemoItem><Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb></DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `// Custom separator\n<BreadcrumbSeparator><Slash /></BreadcrumbSeparator>\n\n// Dropdown / Collapsed use BreadcrumbEllipsis\n<BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>`),

  c("menubar", "Menubar", "Navigation", "A desktop-style menu bar.",
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent><MenubarItem>New Tab</MenubarItem><MenubarItem>New Window</MenubarItem><MenubarSeparator /><MenubarItem>Print</MenubarItem></MenubarContent>
      </MenubarMenu>
      <MenubarMenu><MenubarTrigger>Edit</MenubarTrigger><MenubarContent><MenubarItem>Undo</MenubarItem><MenubarItem>Redo</MenubarItem></MenubarContent></MenubarMenu>
    </Menubar>,
    `<Menubar>\n  <MenubarMenu>\n    <MenubarTrigger>File</MenubarTrigger>\n    <MenubarContent><MenubarItem>New Tab</MenubarItem></MenubarContent>\n  </MenubarMenu>\n</Menubar>`),

  c("navigation-menu", "Navigation Menu", "Navigation", "A collection of links for site navigation.",
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-1 p-2">
              <li><NavigationMenuLink>Introduction</NavigationMenuLink></li>
              <li><NavigationMenuLink>Installation</NavigationMenuLink></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>,
    `<NavigationMenu>\n  <NavigationMenuList>\n    <NavigationMenuItem>\n      <NavigationMenuTrigger>...</NavigationMenuTrigger>\n      <NavigationMenuContent>...</NavigationMenuContent>\n    </NavigationMenuItem>\n  </NavigationMenuList>\n</NavigationMenu>`),

  c("pagination", "Pagination", "Navigation", "Page navigation with previous and next controls.",
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>,
    `<Pagination>\n  <PaginationContent>\n    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>\n    <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>\n  </PaginationContent>\n</Pagination>`),

  c("sidebar", "Sidebar", "Navigation", "A composable, themeable and customizable sidebar component.",
    <SidebarDemo />,
    `<SidebarProvider>\n  <Sidebar>\n    <SidebarHeader>{/* team switcher */}</SidebarHeader>\n    <SidebarContent>\n      <SidebarGroup>\n        <SidebarGroupLabel>Platform</SidebarGroupLabel>\n        <SidebarMenu>\n          <Collapsible asChild defaultOpen>\n            <SidebarMenuItem>\n              <CollapsibleTrigger asChild>\n                <SidebarMenuButton>\n                  <SquareTerminal />\n                  <span>Playground</span>\n                  <ChevronRight className="ml-auto group-data-[state=open]/collapsible:rotate-90" />\n                </SidebarMenuButton>\n              </CollapsibleTrigger>\n              <CollapsibleContent>\n                <SidebarMenuSub>\n                  <SidebarMenuSubItem>\n                    <SidebarMenuSubButton>History</SidebarMenuSubButton>\n                  </SidebarMenuSubItem>\n                </SidebarMenuSub>\n              </CollapsibleContent>\n            </SidebarMenuItem>\n          </Collapsible>\n        </SidebarMenu>\n      </SidebarGroup>\n    </SidebarContent>\n    <SidebarFooter>{/* user menu */}</SidebarFooter>\n  </Sidebar>\n</SidebarProvider>`),

  c("tabs", "Tabs", "Navigation", "Layered sections of content shown one panel at a time.",
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList><TabsTrigger value="account">Account</TabsTrigger><TabsTrigger value="password">Password</TabsTrigger></TabsList>
      <TabsContent value="account" className="text-muted-foreground text-sm">Make changes to your account here.</TabsContent>
      <TabsContent value="password" className="text-muted-foreground text-sm">Change your password here.</TabsContent>
    </Tabs>,
    `<Tabs defaultValue="account">\n  <TabsList><TabsTrigger value="account">Account</TabsTrigger></TabsList>\n  <TabsContent value="account">...</TabsContent>\n</Tabs>`),

  // ───────────────────────── Overlay ─────────────────────────
  c("alert-dialog", "Alert Dialog", "Overlay", "A modal dialog that interrupts with an important confirmation.",
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="outline">Delete account</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Continue</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
    `<AlertDialog>\n  <AlertDialogTrigger asChild><Button>Delete</Button></AlertDialogTrigger>\n  <AlertDialogContent>...</AlertDialogContent>\n</AlertDialog>`),

  c("context-menu", "Context Menu", "Overlay", "A menu triggered by right-click.",
    <ContextMenu>
      <ContextMenuTrigger className="flex h-28 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">Right click here</ContextMenuTrigger>
      <ContextMenuContent><ContextMenuItem>Back</ContextMenuItem><ContextMenuItem>Forward</ContextMenuItem><ContextMenuSeparator /><ContextMenuItem>Reload</ContextMenuItem></ContextMenuContent>
    </ContextMenu>,
    `<ContextMenu>\n  <ContextMenuTrigger>Right click</ContextMenuTrigger>\n  <ContextMenuContent><ContextMenuItem>Back</ContextMenuItem></ContextMenuContent>\n</ContextMenu>`),

  c("dialog", "Dialog", "Overlay", "A modal dialog that interrupts the user with content.",
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Make changes to your profile here.</DialogDescription></DialogHeader>
        <div className="grid gap-2 py-2"><Label htmlFor="dn">Name</Label><Input id="dn" defaultValue="Pedro Duarte" /></div>
        <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>,
    `<Dialog>\n  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>\n  <DialogContent>...</DialogContent>\n</Dialog>`),

  c("drawer", "Drawer", "Overlay", "A panel that slides in from the edge of the screen.",
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader><DrawerTitle>Move goal</DrawerTitle><DrawerDescription>Set your daily activity goal.</DrawerDescription></DrawerHeader>
        <DrawerFooter><Button>Submit</Button><DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose></DrawerFooter>
      </DrawerContent>
    </Drawer>,
    `<Drawer>\n  <DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>\n  <DrawerContent>...</DrawerContent>\n</Drawer>`),

  c("dropdown-menu", "Dropdown Menu", "Overlay", "A menu of actions triggered by a button.",
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Open menu</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start"><DropdownMenuLabel>My Account</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem>Profile</DropdownMenuItem><DropdownMenuItem>Billing</DropdownMenuItem><DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem></DropdownMenuContent>
    </DropdownMenu>,
    `<DropdownMenu>\n  <DropdownMenuTrigger asChild><Button>Open</Button></DropdownMenuTrigger>\n  <DropdownMenuContent>...</DropdownMenuContent>\n</DropdownMenu>`),

  c("hover-card", "Hover Card", "Overlay", "Preview content shown on hover.",
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="link">@nextjs</Button></HoverCardTrigger>
      <HoverCardContent className="text-sm">The React Framework — created and maintained by @vercel.</HoverCardContent>
    </HoverCard>,
    `<HoverCard>\n  <HoverCardTrigger asChild><Button variant="link">@nextjs</Button></HoverCardTrigger>\n  <HoverCardContent>...</HoverCardContent>\n</HoverCard>`),

  c("popover", "Popover", "Overlay", "Rich floating content triggered by a button.",
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
      <PopoverContent className="w-72"><div className="grid gap-2"><p className="text-sm font-medium">Dimensions</p><Label htmlFor="w">Width</Label><Input id="w" defaultValue="100%" /></div></PopoverContent>
    </Popover>,
    `<Popover>\n  <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>\n  <PopoverContent>...</PopoverContent>\n</Popover>`),

  c("sheet", "Sheet", "Overlay", "A panel that slides in to complement the main content.",
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open sheet</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader><SheetTitle>Edit profile</SheetTitle><SheetDescription>Make changes to your profile here.</SheetDescription></SheetHeader>
      </SheetContent>
    </Sheet>,
    `<Sheet>\n  <SheetTrigger asChild><Button>Open</Button></SheetTrigger>\n  <SheetContent>...</SheetContent>\n</Sheet>`),

  c("tooltip", "Tooltip", "Overlay", "A floating label shown on hover or focus.",
    <TooltipProvider>
      <Tooltip><TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger><TooltipContent>Add to library</TooltipContent></Tooltip>
    </TooltipProvider>,
    `<Tooltip>\n  <TooltipTrigger asChild><Button>Hover me</Button></TooltipTrigger>\n  <TooltipContent>Add to library</TooltipContent>\n</Tooltip>`),

  // ───────────────────────── Data ─────────────────────────
  c("accordion", "Accordion", "Data", "A vertically stacked set of expandable headings.",
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1"><AccordionTrigger>Is it accessible?</AccordionTrigger><AccordionContent>Yes. It adheres to the WAI-ARIA pattern.</AccordionContent></AccordionItem>
      <AccordionItem value="item-2"><AccordionTrigger>Is it styled with tokens?</AccordionTrigger><AccordionContent>Yes. Every color is a semantic token.</AccordionContent></AccordionItem>
    </Accordion>,
    `<Accordion type="single" collapsible>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Is it accessible?</AccordionTrigger>\n    <AccordionContent>Yes.</AccordionContent>\n  </AccordionItem>\n</Accordion>`),

  c("collapsible", "Collapsible", "Data", "An interactive section that expands and collapses.",
    <Collapsible className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">@peduarte starred 3 repos</span><CollapsibleTrigger asChild><Button variant="ghost" size="sm">Toggle</Button></CollapsibleTrigger></div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>
      <CollapsibleContent className="space-y-2"><div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div><div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div></CollapsibleContent>
    </Collapsible>,
    `<Collapsible>\n  <CollapsibleTrigger>Toggle</CollapsibleTrigger>\n  <CollapsibleContent>...</CollapsibleContent>\n</Collapsible>`),

  c("command", "Command", "Data", "A fast, composable command palette.",
    <Command className="w-full max-w-sm rounded-lg border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions"><CommandItem><Star className="size-4" />Calendar</CommandItem><CommandItem><Search className="size-4" />Search Emoji</CommandItem></CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings"><CommandItem>Profile</CommandItem><CommandItem>Billing</CommandItem></CommandGroup>
      </CommandList>
    </Command>,
    `<Command>\n  <CommandInput placeholder="Type a command..." />\n  <CommandList><CommandGroup heading="Suggestions"><CommandItem>Calendar</CommandItem></CommandGroup></CommandList>\n</Command>`),

  c("data-table", "Data Table", "Data", "A sortable, structured table — Table composed with sorting state (TanStack-ready).",
    <DataTableDemo />,
    `// Data Table = Table + @tanstack/react-table (or local sort state)\n<Table>\n  <TableHeader>...sortable headers...</TableHeader>\n  <TableBody>{rows.map(...)}</TableBody>\n</Table>`),

  c("separator", "Separator", "Data", "Visually or semantically separates content.",
    <div className="w-full max-w-sm">
      <div className="space-y-1"><p className="text-sm font-medium">Radix Primitives</p><p className="text-muted-foreground text-sm">An open-source UI component library.</p></div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm"><span>Blog</span><Separator orientation="vertical" /><span>Docs</span><Separator orientation="vertical" /><span>Source</span></div>
    </div>,
    `<Separator />\n<Separator orientation="vertical" />`),

  // ───────────────────────── Feedback ─────────────────────────
  c("alert", "Alert", "Feedback", "Displays a callout for user attention.",
    <DemoShowcase>
      <DemoSection label="Variants">
        <DemoItem caption="default" className="w-full max-w-md items-stretch">
          <Alert><Bell className="size-4" /><AlertTitle>Heads up!</AlertTitle><AlertDescription>You can add components to your app using the CLI.</AlertDescription></Alert>
        </DemoItem>
        <DemoItem caption="destructive" className="w-full max-w-md items-stretch">
          <Alert variant="destructive"><Bell className="size-4" /><AlertTitle>Something went wrong</AlertTitle><AlertDescription>Your session has expired. Please log in again.</AlertDescription></Alert>
        </DemoItem>
      </DemoSection>
    </DemoShowcase>,
    `<Alert>\n  <Bell />\n  <AlertTitle>Heads up!</AlertTitle>\n  <AlertDescription>...</AlertDescription>\n</Alert>`),

  c("sonner", "Sonner", "Feedback", "An opinionated toast notification system.",
    <SonnerDemo />,
    `import { toast } from "sonner"\n\ntoast("Event created", {\n  description: "Sunday, December 03 at 9:00 AM",\n  action: { label: "Undo", onClick: () => {} },\n})`),

  // ───────────────────────── Utility ─────────────────────────
  c("aspect-ratio", "Aspect Ratio", "Utility", "Constrains content to a desired ratio.",
    <div className="w-full max-w-sm"><AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center rounded-lg"><span className="text-muted-foreground text-sm font-mono">16 / 9</span></AspectRatio></div>,
    `<AspectRatio ratio={16 / 9}>\n  <img src="..." alt="..." className="rounded-lg object-cover" />\n</AspectRatio>`),

  c("calendar", "Calendar", "Utility", "A date field for selecting dates.",
    <Calendar mode="single" className="rounded-md border" />,
    `<Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />`),

  c("date-picker", "Date Picker", "Utility", "A date field — Popover composed with Calendar.",
    <DatePickerDemo />,
    `// Date Picker = Popover + Calendar\n<Popover>\n  <PopoverTrigger asChild><Button variant="outline">{date ? format(date, "PPP") : "Pick a date"}</Button></PopoverTrigger>\n  <PopoverContent><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent>\n</Popover>`),

  c("scroll-area", "Scroll Area", "Utility", "A scrollable region with a styled scrollbar.",
    <ScrollArea className="h-40 w-full max-w-xs rounded-md border p-4">
      <div className="space-y-2">{Array.from({ length: 20 }).map((_, i) => (<div key={i} className="text-sm">Item {i + 1}</div>))}</div>
    </ScrollArea>,
    `<ScrollArea className="h-40 rounded-md border p-4">\n  {items.map(...)}\n</ScrollArea>`),

  // ───────────────────────── Foundations ─────────────────────────
  { slug: "icons", title: "Icons", category: "Foundations", reference: true, code: "",
    description: "The Lucide outline icon set, rendered live from lucide-react — searchable, click to copy. Mirrors the Figma “Lucide - Outline” library.",
    demo: <IconLibrary /> },

  // ───────────────────────── Design Tokens ─────────────────────────
  { slug: "colors", title: "Colors", category: "Design Tokens", reference: true, code: "",
    description: "Every color value pulled live from the Figma export — 35 semantic tokens, the Tailwind palette, and the Radix scale.",
    demo: <ColorsReference /> },
  { slug: "typography", title: "Typography", category: "Design Tokens", reference: true, code: "",
    description: "Font families, sizes, weights, line height, and tracking — pulled from the font tokens.",
    demo: <TypographyReference /> },
  { slug: "spacing", title: "Spacing", category: "Design Tokens", reference: true, code: "",
    description: "The spacing scale on a 4px base unit, pulled from the gap tokens.",
    demo: <SpacingReference /> },
  { slug: "radius", title: "Radius", category: "Design Tokens", reference: true, code: "",
    description: "Border-radius steps pulled from the Figma export.",
    demo: <RadiusReference /> },
];

export function getEntry(slug: string): DocEntry | undefined {
  return registry.find((e) => e.slug === slug);
}

export type NavGroup = { title: DocCategory; items: { title: string; slug: string }[] };

export function getNavGroups(): NavGroup[] {
  return CATEGORY_ORDER.map((cat) => ({
    title: cat,
    items: registry.filter((e) => e.category === cat).map((e) => ({ title: e.title, slug: e.slug })),
  })).filter((g) => g.items.length > 0);
}
