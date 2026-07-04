import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/ui/input";
import { getEntry } from "@/components/docs/registry";

const meta: Meta<typeof Input> = {
  title: "Form & Input/Input",
  component: Input,
  parameters: { docs: { description: { component: getEntry("input")?.description } } },
  args: { placeholder: "Email", type: "text", disabled: false },
  argTypes: {
    type: { control: "select", options: ["text", "email", "password", "number", "search", "tel", "url"] },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "xl"] as const).map((s) => (
        <Cell key={s} label={s}>
          <Input size={s} placeholder={`Size ${s}`} aria-label={`Size ${s}`} />
        </Cell>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: "States",
  parameters: {
    docs: { description: { story: "Default, focus (reproduces the focus ring), filled, disabled, and error (`aria-invalid`) — all token-driven." } },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Cell label="default"><Input placeholder="Email" aria-label="Email default" /></Cell>
      <Cell label="focus"><Input placeholder="Email" aria-label="Email focus" className="border-ring ring-ring/50 ring-3" /></Cell>
      <Cell label="filled"><Input defaultValue="hello@example.com" aria-label="Email filled" /></Cell>
      <Cell label="disabled"><Input placeholder="Email" aria-label="Email disabled" disabled /></Cell>
      <Cell label="error (aria-invalid)"><Input defaultValue="not-an-email" aria-label="Email error" aria-invalid /></Cell>
    </div>
  ),
};

export const Demo: Story = { name: "Demo (states)", render: () => <>{getEntry("input")!.demo}</> };
