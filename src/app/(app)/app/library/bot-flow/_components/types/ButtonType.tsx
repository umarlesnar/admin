import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import ButtonTypeSheet from "../flow-sheets/ButtonTypeSheet";
import CustomHandle from "../CustomHandler";
import { ButtonFlowIcon } from "@/components/ui/icons/ButtonFlowIcon";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";

const ButtonType = ({ data, id }: any) => {
  const { nodes, deleteNode, updateNodeData, setStartNode } = useStore();
  const { flow_replies, expected_answers } = data;
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
          <ButtonFlowIcon className="w-[18px] h-[18px] text-orange-500" />
          <Text size="sm" weight="semibold" textColor="text-primary-900">
            Buttons
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
          <ButtonTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </ButtonTypeSheet>

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

      {expected_answers.map((items: any, index: any) => {
        return (
          <div key={index} className="relative">
            <button className="w-full h-8 text-xs  rounded-md bg-gray-100 my-1 relative">
              <p className="w-90p">{items.expected_input}</p>
            </button>
            <div className="absolute top-5 right-2">
              <CustomHandle
                type="source"
                position={Position.Right}
                id={items.id}
                style={{
                  top: index * 0.00001,
                  width: "9px",
                  height: "9px",
                  background: "#00ab41",
                  cursor: "pointer",
                }}
                onConnect={(params: any) => {
                  if (updateNodeData) {
                    updateNodeData(id, {
                      ...data,
                      expected_answers: expected_answers.map(
                        (ea_item: any, inx: number) => {
                          if (ea_item.id == params.sourceHandle) {
                            ea_item = {
                              ...ea_item,
                              node_result_id: params.target,
                            };
                          }

                          return ea_item;
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
  );
};

export default ButtonType;
