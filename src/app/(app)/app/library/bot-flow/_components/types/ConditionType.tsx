import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import ConditionTypeSheet from "../flow-sheets/ConditionTypeSheet";
import CustomHandle from "../CustomHandler";
import { ConditionIcon } from "@/components/ui/icons/ConditionIcon";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";

const ConditionType = ({ data, id }: any) => {
  const { nodes, deleteNode, updateNodeData, setStartNode } = useStore();

  return (
    <div className="w-60  bg-white rounded-md p-1 group relative">
      {data.is_start_node ? <StartNodeLabel /> : null}
      {data.is_start_node ? null : (
        <Handle
          type="target"
          position={Position.Left}
          id={"target-main-" + id}
          style={{
            background: "#3B82F6",
            borderColor: "#3B82F6",
            position: "absolute",
            top: 21,
            left: -10,
            borderRadius: 0,
            rotate: " z 45deg",
            width: "12px",
            height: "12px",
          }}
        />
      )}
      <div className="w-full h-10 bg-violet-100 rounded flex items-center justify-between gap-3 p-2">
        <div className="flex items-center gap-2">
          <ConditionIcon className="w-[18px] h-[18px] text-violet-500" />
          <Text size="sm" weight="semibold" textColor="text-primary-900">
            Set a Condition
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
          <ConditionTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </ConditionTypeSheet>
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
        <div className="w-full h-auto py-2 bg-gray-100 rounded-md my-2 relative">
          <div className="w-[95%] h-auto text-center">
            <Text size="sm" className="leading-5">
              On Success
            </Text>
          </div>
          <div className="absolute right-2 top-1/2  transform -translate-x-1/2">
            <CustomHandle
              type="source"
              position={Position.Right}
              id={`ed-${"b"}`}
              style={{
                width: "12px",
                height: "12px",
                background: "#00ab41",
                cursor: "pointer",
              }}
              onConnect={(params: any) => {
                if (updateNodeData) {
                  updateNodeData(id, {
                    ...data,
                    condition_result: {
                      ...data.condition_result,
                      y_result_node_id: params.target,
                    },
                  });
                }
              }}
            />
          </div>
        </div>
        <div className="w-full h-auto py-2 bg-gray-100 rounded-md my-2 relative">
          <div className="w-[95%] h-auto text-center">
            <Text size="sm" className="leading-5">
              On Fail
            </Text>
          </div>
          <div className="absolute right-2 top-1/2  transform -translate-x-1/2">
            <CustomHandle
              type="source"
              position={Position.Right}
              id={`ed-${"c"}`}
              style={{
                width: "12px",
                height: "12px",
                background: "#FF0000",
                cursor: "pointer",
              }}
              onConnect={(params: any) => {
                if (updateNodeData) {
                  updateNodeData(id, {
                    ...data,
                    condition_result: {
                      ...data.condition_result,
                      y_result_node_id: params.target,
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

export default ConditionType;
