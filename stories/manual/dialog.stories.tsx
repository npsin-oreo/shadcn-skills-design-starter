import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getEntry } from "@/components/docs/registry";

type Args = { defaultOpen: boolean; title: string; description: string };

const meta: Meta<Args> = {
  title: "Overlay/Dialog",
  parameters: { docs: { description: { component: getEntry("dialog")?.description } } },
  args: {
    defaultOpen: true,
    title: "Edit profile",
    description: "Make changes to your profile here. Click save when you're done.",
  },
  argTypes: {
    defaultOpen: { control: "boolean", description: "Open the dialog on mount" },
    title: { control: "text" },
    description: { control: "text" },
  },
  render: ({ defaultOpen, title, description }) => (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const WithForm: Story = {
  name: "With form",
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your details. Changes are saved when you click Save.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <Field>
            <FieldLabel htmlFor="d-name">Name</FieldLabel>
            <Input id="d-name" defaultValue="Tim Cook" />
          </Field>
          <Field>
            <FieldLabel htmlFor="d-email">Email</FieldLabel>
            <Input id="d-email" type="email" defaultValue="jane@example.com" />
          </Field>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Destructive: Story = {
  name: "Destructive confirm",
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account?</DialogTitle>
          <DialogDescription>This permanently removes your account and all data. This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Demo: Story = { name: "Demo", render: () => <>{getEntry("dialog")!.demo}</> };
