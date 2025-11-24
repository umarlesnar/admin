import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useStore from "../store";
import StartNodeLabel from "../StartNodeLabel";
import { Handle, Position } from "react-flow-renderer";
import { MessageCircleMore } from "lucide-react";
import CatalogueProductTypeSheet from "../flow-sheets/CatalogueProductTypeSheet";
import { ProductIcon } from "@/components/ui/icons/ProductIcon";
import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";

const CatalogueProductType = ({ data, id }: any) => {
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
            top: "50%",
            transform: "translateY(-50%)",
            left: -10,
            borderRadius: 0,
            rotate: " z 45deg",
          }}
        />
      )}
      <div className="w-full h-full bg-primary-50 rounded space-y-2 p-2">
        <div className="w-full  flex items-start justify-between gap-3 ">
          <div className="flex items-start gap-2 ">
            <ProductIcon className="w-[18px] h-[18px] text-green-500" />
            <div className=" space-y-1">
              <Text size="sm" weight="semibold" textColor="text-primary-900">
                Product
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
            <CatalogueProductTypeSheet sheetData={data} id={id}>
              <EditIcon className="w-3 h-3 cursor-pointer" />
            </CatalogueProductTypeSheet>

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
        {data?.catalog_id && (
          <div className="w-full h-auto flex items-start gap-2">
            {data?.image_url ? (
              <img src={data?.image_url} className="w-14 h-14 rounded-sm" />
            ) : null}

            <div>
              <Text size="xs" weight="medium">
                {data?.name}
              </Text>
              <Text size="xs" weight="medium" className="text-[8px]">
                {data?.product_price}
              </Text>
              <Text size="xs" weight="medium" className="text-[8px]">
                {data?.retailer_id}
              </Text>
            </div>
          </div>
        )}
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
          top: "50%",
          transform: "translateY(-50%)",
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

export default CatalogueProductType;
