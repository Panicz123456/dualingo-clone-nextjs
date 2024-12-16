import { Button } from "@/components/ui/button";

const ButtonsPage = () => {
  return (
    <div className="p-4 space-y-4 flex flex-col max-w-[200px]">
      <Button>default</Button>
      <Button variant="primary">primary</Button>
      <Button variant="primaryOutline">Primary Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="secondaryOutline">Secondary Outline</Button>
      <Button variant="danger">danger</Button>
      <Button variant="dangerOutline">danger Outline</Button>
      <Button variant="super">super</Button>
      <Button variant="superOutline">super Outline</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="sidebar">sidebar</Button>
      <Button variant="sidebarOutline">sidebarOutline</Button>
    </div>
  );
};

export default ButtonsPage;
