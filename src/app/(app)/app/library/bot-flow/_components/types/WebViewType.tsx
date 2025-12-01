import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";
import { LocationIcon } from "@/components/ui/icons/LocationIcon";
import AskAddressTypeSheet from "../flow-sheets/AskAddressTypeSheet";
import WebViewTypeSheet from "../flow-sheets/WebViewTypeSheet";
import { Button } from "@/components/ui/button";
import { WebViewIcon } from "@/components/ui/icons/WebViewIcon";

const WebViewType = ({ data, id }: any) => {
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
          <WebViewIcon className="w-[18px] h-[18px] text-orange-500" />
          <Text size="sm" weight="semibold" textColor="text-primary-900">
            Webview
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
          <WebViewTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </WebViewTypeSheet>

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
      {flow_replies?.header_text && (
        <div className="p-3">
          <Text size="base" color="primary" className="leading-4">
            {flow_replies?.header?.text}
          </Text>
        </div>
      )}

      <div className="p-3">
        <Text size="sm" color="primary" className="leading-3">
          {flow_replies?.body_text}
        </Text>
      </div>

      {flow_replies?.footer?.text && (
        <div className="p-3">
          <Text size="xs" color="secondary" className="leading-3">
            {flow_replies?.footer_text}
          </Text>
        </div>
      )}

      <div className="px-2">
        <Button className="w-full" variant="outline">
          {flow_replies?.button_text}
        </Button>
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

export default WebViewType;