import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LegacyLists } from "./LegacyList";
import { ClassicLists } from "./ClassicList";

const ApiKeyTabsPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="classic" className="w-full h-full flex flex-col">
        <TabsList className="grid w-[300px] grid-cols-2 flex-shrink-0">
          <TabsTrigger value="classic">Classic</TabsTrigger>
          <TabsTrigger value="legacy">Legacy</TabsTrigger>
        </TabsList>
        <TabsContent value="classic" className="flex-1 overflow-hidden">
          <div className="p-4 h-full">
            <ClassicLists />
          </div>
        </TabsContent>
        <TabsContent value="legacy" className="flex-1 overflow-hidden">
          <div className="p-4 h-full">
            <LegacyLists />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiKeyTabsPage;
