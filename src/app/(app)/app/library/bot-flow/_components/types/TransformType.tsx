import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";
import TransformTypeSheet from "../flow-sheets/TransformTypeSheet";
import { TransformIcon } from "@/components/ui/icons/TransformIcon";

const TransformType = ({ data, id }: any) => {
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

      <div className="w-full h-full bg-primary-50 rounded flex items-start justify-between gap-3 p-2">
        <div className="flex items-start gap-2 ">
          <TransformIcon className="w-[18px] h-[18px] text-violet-500" />
          <div>
            <Text size="sm" weight="semibold" textColor="text-primary-900">
              Transform
            </Text>
          </div>
        </div>
        <div className="group-hover:flex items-center gap-2 hidden mt-1">
          {!data.is_start_node && (
            <FlowStartIcon
              className="w-3 h-3 cursor-pointer"
              onClick={() => {
                setStartNode && setStartNode(id);
              }}
            />
          )}

          <TransformTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </TransformTypeSheet>
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
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "12px",
          height: "12px",
          background: "#3B82F6",
          borderColor: "#3B82F6",
          position: "absolute",
          top: 21,
          right: -1,
          borderRadius: 0,
          rotate: " z 45deg",
        }}
        onConnect={(params: any) => {
          if (updateNodeData) {
            updateNodeData(id, {
              ...data,
              node_result_id: params.target,
            });
          }
        }}
      />
    </div>
  );
};

export default TransformType;