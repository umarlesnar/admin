import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import OperatorTypeSheet from "../flow-sheets/OperatorTypeSheet";
import { AssignMemberIcon } from "@/components/ui/icons/AssignMemberIcon";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";

const OperatorType = ({ data, id }: any) => {
  const { nodes, deleteNode, setStartNode } = useStore();

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
          <AssignMemberIcon className="w-[18px] h-[18px] text-green-500" />
          <div>
            <Text size="sm" weight="semibold" textColor="text-primary-900">
              Assign Operator
            </Text>
            {data?.operator && (
              <Text
                size="xs"
                weight="semibold"
                color="secondary"
                className="text-[9px] mt-1"
              >
                {data?.operator?.name}
              </Text>
            )}
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
          <OperatorTypeSheet sheetData={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </OperatorTypeSheet>
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
    </div>
  );
};

export default OperatorType;
