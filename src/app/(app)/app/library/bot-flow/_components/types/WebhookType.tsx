import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import WebhookTypeSheet from "../flow-sheets/webhook-sheet/WebhookTypeSheet";
import CustomHandle from "../CustomHandler";
import { WebhookIcon } from "@/components/ui/icons/WebhookIcon";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";

const WebhookType = ({ data, id }: any) => {
  const { nodes, deleteNode, updateNodeData, setStartNode } = useStore();

  return (
    <div className="w-60 bg-white rounded-md p-1 group relative">
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
      <div className="w-full h-full bg-yellow-100 rounded flex items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-2">
          <WebhookIcon className="w-[18px] h-[18px] text-yellow-500" />
          <div>
            <Text size="sm" weight="semibold" textColor="text-primary-900">
              Webhook
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
          <WebhookTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </WebhookTypeSheet>

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
      <div className="w-full p-3">
        {data?.expected_status_code.map((items: any, index: any) => {
          return (
            <div key={index} className="relative mx-1">
              <button className="w-full h-8 text-xs  rounded-md bg-gray-100 my-1 relative">
                <p className="w-90p">{items.status_code}</p>
              </button>
              <div className="absolute top-5 right-3">
                <CustomHandle
                  type="source"
                  position={Position.Right}
                  id={items.id}
                  style={{
                    top: index * 0.00001,
                    width: "9px",
                    height: "9px",
                    background: "#e6cc10",
                    cursor: "pointer",
                  }}
                  onConnect={(params: any) => {
                    if (updateNodeData) {
                      updateNodeData(id, {
                        ...data,
                        expected_status_code: data.expected_status_code.map(
                          (esc_item: any, inx: number) => {
                            if (esc_item.id == params.sourceHandle) {
                              esc_item = {
                                ...esc_item,
                                node_result_id: params.target,
                              };
                            }

                            return esc_item;
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
      </div>
    </div>
  );
};

export default WebhookType;
