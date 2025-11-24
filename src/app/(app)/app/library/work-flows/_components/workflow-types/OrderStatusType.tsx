import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { OrderStatusIcon } from "@/components/ui/icons/OrderStatusIcon";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";
import useWorkflowStore from "../WorkflowStore";
import WorkflowStartNodeLabel from "../WorflowStartNodeLabel";
import WorkflowOrderStatusSheet from "../workflow-sheet/WorkflowOrderStatusSheet";

const WorkflowOrderStatusType = ({ data, id }: any) => {
  const { nodes, deleteNode, setStartNode, updateNodeData } =
    useWorkflowStore();

  return (
    <div className="w-72 h-14 bg-white rounded-md p-1 group relative">
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
            top: "50%",
            transform: "translateY(-50%)",
            left: -10,
            borderRadius: 0,
            rotate: " z 45deg",
          }}
        />
      )}
      <div className="w-full h-full bg-primary-50 rounded flex items-center justify-between gap-3 p-2">
        <div className="flex items-center gap-2">
          <OrderStatusIcon className="w-[18px] h-[18px] text-green-500" />
          <div>
            <Text size="sm" weight="semibold" textColor="text-primary-900">
              Send Order Status
            </Text>
          </div>
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
          <WorkflowOrderStatusSheet sheetData={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </WorkflowOrderStatusSheet>

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

export default WorkflowOrderStatusType;
