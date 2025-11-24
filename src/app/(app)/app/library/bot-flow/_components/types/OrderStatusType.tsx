import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import OrderStatusTypeSheet from "../flow-sheets/OrderStatusTypeSheet";
import classNames from "classnames";
import { OrderStatusIcon } from "@/components/ui/icons/OrderStatusIcon";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";

const OrderStatusType = ({ data, id }: any) => {
  const { nodes, deleteNode, setStartNode } = useStore();

  return (
    <div className="w-72 h-14 bg-white rounded-md p-1 group relative">
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
              Update Order Status
            </Text>
            <div className="w-full  flex items-center space-x-1">
              <div
                className={classNames("w-2 h-2 rounded-full", {
                  "bg-sky-500": data?.status == "confirm",
                  "bg-blue-500": data?.status == "processing",
                  "bg-green-500": data?.status == "delivered",
                  "bg-red-500": data?.status == "cancelled",
                  "bg-yellow-500": data?.status == "pending",
                })}
              ></div>
              <Text size="xs" color="secondary">
                {data?.status}
              </Text>
            </div>
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
          <OrderStatusTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </OrderStatusTypeSheet>

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

export default OrderStatusType;
