import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import { MessageCircleMore } from "lucide-react";
import classNames from "classnames";
import ChatStatusTypeSheet from "../flow-sheets/ChatStatusTypeSheet";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";

const ChatStatusType = ({ data, id }: any) => {
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
      <div className="w-full h-full bg-primary-50 rounded flex items-center justify-between gap-3 p-2">
        <div className="flex items-center gap-2">
          <MessageCircleMore className="w-[18px] h-[18px] text-green-500" />
          <div>
            <Text size="sm" weight="semibold" textColor="text-primary-900">
              Update Chat Status
            </Text>
            <div className="w-full  flex items-center space-x-1">
              <div
                className={classNames("w-2 h-2 rounded-full", {
                  "bg-blue-500":
                    data?.status == "open" || data?.status == "broadcast",
                  "bg-black ": data?.status == "blocked",
                  "bg-green-500": data?.status == "solved",
                  "bg-red-500": data?.status == "expired",
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
          <ChatStatusTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </ChatStatusTypeSheet>
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

export default ChatStatusType;
