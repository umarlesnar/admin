import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersLists } from "./UserLists";
import { SystemUserLists } from "./SystemUser";

const UserTabsPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="user" className="w-full h-full flex flex-col">
        <TabsList className="grid w-[300px] grid-cols-2 flex-shrink-0">
          <TabsTrigger value="user">Users</TabsTrigger>
          <TabsTrigger value="systemuser">System Users</TabsTrigger>
        </TabsList>
        <TabsContent value="user" className="flex-1 overflow-hidden">
          <div className="p-4 h-full">
            <UsersLists />
          </div>
        </TabsContent>
        <TabsContent value="systemuser" className="flex-1 overflow-hidden">
          <div className="p-4 h-full">
            <SystemUserLists />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserTabsPage;
