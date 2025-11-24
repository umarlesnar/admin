import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { SwitchIcon } from "@/components/ui/icons/SwitchIcon";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";
import useWorkflowStore from "../WorkflowStore";
import WorkflowStartNodeLabel from "../WorflowStartNodeLabel";
import WorkflowCustomHandle from "../WorkflowCustomHandle";
import WorkflowSwitchSheet from "../workflow-sheet/WorkflowSwitchSheet";

const WorkflowSwitchType = ({ data, id }: any) => {
  const { nodes, deleteNode, updateNodeData, setStartNode } =
    useWorkflowStore();

  return (
    <div className="w-60  bg-white rounded-md p-1 group relative">
      {data.is_start_node ? <WorkflowStartNodeLabel /> : null}
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
      <div className="w-full h-10 bg-violet-100 rounded flex items-center justify-between gap-3 p-2">
        <div className="flex items-center gap-2">
          <SwitchIcon className="w-[18px] h-[18px] text-violet-500" />
          <Text size="sm" weight="semibold" textColor="text-primary-900">
            Switch Condition
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
          <WorkflowSwitchSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </WorkflowSwitchSheet>

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
      <div className="p-3">
        {data.switch_conditions?.map((items: any, index: any) => {
          return (
            <div key={index} className="relative">
              <button className="w-full h-8 text-xs  rounded-md bg-gray-100 my-1 relative flex items-center justify-center">
                <p className="w-[90%] truncate">{items.text}</p>
              </button>
              <div
                className="absolute right-2"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <WorkflowCustomHandle
                  type="source"
                  position={Position.Right}
                  id={items.id}
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
                        switch_conditions: data.switch_conditions.map(
                          (sc_item: any, inx: number) => {
                            if (sc_item.id == params.sourceHandle) {
                              sc_item = {
                                ...sc_item,
                                node_result_id: params.target,
                              };
                            }

                            return sc_item;
                          }
                        ),
                      });
                    }
                  }}
                />
              </div>
            </div>
          );
        })}

        <div className="w-full h-8 text-xs  rounded-md bg-gray-100 my-1 relative flex justify-center items-center">
          <Text size="xs" className="text-center w-[90%] truncate p-1">
            {data?.default_condition?.text}
          </Text>
          <div className="absolute top-4 right-2">
            <Handle
              type="source"
              position={Position.Right}
              id={id}
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
                    default_condition: {
                      ...data?.default_condition,
                      node_result_id: params.target,
                    },
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSwitchType;
