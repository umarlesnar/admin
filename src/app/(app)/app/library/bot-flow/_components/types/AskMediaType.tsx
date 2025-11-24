import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";
import { MediaIcon } from "@/components/ui/icons/MediaIcon";
import AskMediaTypeSheet from "../flow-sheets/AskMediaTypeSheet";

const AskMediaType = ({ data, id }: any) => {
  const { nodes, deleteNode, updateNodeData, setStartNode } = useStore();
  const { flow_replies } = data;

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
        <div className="flex items-center gap-2">
          <MediaIcon className="w-[18px] h-[18px] text-orange-500" />
          <Text size="sm" weight="semibold" textColor="text-primary-900">
            Ask Media
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
          <AskMediaTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </AskMediaTypeSheet>

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
        <Text size="xs" color="secondary" className="leading-5">
          {flow_replies.data}
        </Text>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "12px",
          height: "12px",
          background: "#3B82F6",
          border: 4,
          borderStyle: "solid",
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

export default AskMediaType;
