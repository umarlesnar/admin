import React, { useState } from "react";
import { EdgeProps, getBezierPath, getEdgeCenter } from "@xyflow/react";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import useWorkflowStore from "./WorkflowStore";

export default function WorkflowCustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  ...props
}: EdgeProps) {
  const foreignObjectSize = 40;
  const { deleteEdge } = useWorkflowStore((state) => state);
  const [isHovered, setIsHovered] = useState(false);
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteEdge && deleteEdge(id);
  };

  return (
    <>
      {/* Curved Edge Path with Static Stroke Width */}
      <path
        id={id}
        //@ts-ignore
        d={edgePath}
        markerEnd={markerEnd}
        className="react-flow__edge-path"
        stroke="gray"
        strokeWidth={10}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: isHovered ? "pointer" : "default" }}
      />

      {isHovered && (
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={edgeCenterX - foreignObjectSize / 2}
          y={edgeCenterY - foreignObjectSize / 2}
          className="pointer-events-auto"
        >
          <div className="w-full h-full flex justify-center items-center">
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <DeleteIcon className="w-4 h-4" />
            </button>
          </div>
        </foreignObject>
      )}
    </>
  );
}
