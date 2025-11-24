import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import CustomHandle from "../CustomHandler";
import ListTypeSheet from "../flow-sheets/ListTypeSheet";
import { Button } from "@/components/ui/button";
import { ListFlowIcon } from "@/components/ui/icons/ListFlowIcon";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";

const ListType = ({ data, id }: any) => {
  const { nodes, deleteNode, updateNodeData, setStartNode } = useStore();
  const { interactiveListSections } = data;
  return (
    <div className="w-60  bg-white rounded-md p-1 group relative">
      {data.is_start_node ? <StartNodeLabel /> : null}
      {data.is_start_node ? null : (
        <Handle
          type="target"
          position={Position.Left}
          id={"target-main-" + id}
          style={{
            width: "12px",
            height: "12px",
            background: "#3B82F6",
            borderColor: "#3B82F6",
            position: "absolute",
            top: 21,
            left: -10,
            borderRadius: 0,
            rotate: " z 45deg",
          }}
        />
      )}
      <div className="w-full h-10 bg-orange-100 rounded flex items-center justify-between gap-3 p-2">
        <div className="flex items-center gap-3">
          <ListFlowIcon className="w-[18px] h-[18px] text-orange-500" />
          <Text size="sm" weight="semibold" textColor="text-primary-900">
            List
          </Text>
        </div>
        <div className="group-hover:flex items-center gap-2 hidden">
          {!data.is_start_node && (
            <FlowStartIcon
              className="w-3 h-3 cursor-pointer"
              onClick={() => {
                setStartNode && setStartNode(id);
              }}
            />
          )}
          <ListTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </ListTypeSheet>
          <DeleteIcon
            className="w-3 h-3 cursor-pointer text-red-500"
            onClick={() => {
              if (typeof deleteNode == "function") {
                deleteNode(id);
              }
            }}
          />
        </div>
      </div>
      <div className="p-3 space-y-4">
        <Text size="base" weight="semibold" className="leading-5">
          {data?.interactiveListHeader}
        </Text>
        <Text size="sm" className="leading-5">
          {data?.interactiveListBody}
        </Text>
        <Text size="xs" color="secondary" className="leading-5">
          {data?.interactiveListFooter}
        </Text>
        {/* <Text size="xs" color="secondary" className="leading-5">
          {data?.interactiveListButton}
        </Text> */}
      </div>

      <Button className="w-full" size="sm">
        {" "}
        {data?.interactiveListButton}
      </Button>

      <div className="p-3 ">
        {interactiveListSections?.map((section: any) => {
          return (
            <div className="w-full h-auto py-2" key={section?.id}>
              <p className="text-xs font-medium ">{section?.title}</p>
              {section?.rows?.map((row: any) => {
                return (
                  <div
                    className="w-full h-auto py-2 bg-gray-100 rounded-md my-2 relative"
                    key={row?.id}
                  >
                    <div className="w-[95%] h-auto text-center">
                      <Text size="sm" className="leading-5">
                        {row?.title}
                      </Text>
                      <p className="text-xs font-normal text-base-primary"></p>
                      {row?.description ? (
                        <Text size="xs" color="secondary" className="leading-5">
                          {row?.description}
                        </Text>
                      ) : null}
                    </div>
                    <div className="absolute right-2 top-1/2  transform -translate-x-1/2">
                      <CustomHandle
                        type="source"
                        position={Position.Right}
                        id={row?.id}
                        style={{
                          width: "9px",
                          height: "9px",
                          background: "#00ab41",
                          cursor: "pointer",
                        }}
                        onConnect={(params: any) => {
                          if (updateNodeData) {
                            updateNodeData(id, {
                              ...data,
                              interactiveListSections:
                                interactiveListSections?.map((section: any) => {
                                  return {
                                    ...section,
                                    rows: section?.rows?.map((row: any) => {
                                      if (row?.id === params.sourceHandle) {
                                        return {
                                          ...row,
                                          node_result_id: params.target,
                                        };
                                      } else {
                                        return {
                                          ...row,
                                        };
                                      }
                                    }),
                                  };
                                }),
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListType;
