import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemRolesLists } from "./SystemRolesList";
import { RolesLists } from "./RolesList";

const RoleTabsPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="systemroles" className="w-full h-full flex flex-col">
        <TabsList className="grid w-[300px] grid-cols-2 flex-shrink-0">
          <TabsTrigger value="systemroles">System Role</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="systemroles" className="flex-1 overflow-hidden">
          <div className="p-4 h-full">
            <SystemRolesLists />
          </div>
        </TabsContent>
        <TabsContent value="roles" className="flex-1 overflow-hidden">
          <div className="p-4 h-full">
            <RolesLists />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoleTabsPage;
