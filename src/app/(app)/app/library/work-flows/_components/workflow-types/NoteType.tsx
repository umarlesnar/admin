import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import Text from "@/components/ui/text";
import React from "react";
import useWorkflowStore from "../WorkflowStore";
import NoteTypeSheet from "../workflow-sheet/NoteSheet";

const NoteType = ({ data, id }: any) => {
  const { deleteNode } = useWorkflowStore();

  const noteText = data?.text;

  return (
    <div className="w-60 bg-white rounded-md p-1 group relative">
      <div className="w-full h-full bg-yellow-50 rounded flex items-start justify-between gap-3 p-2">       
          <Text
            size="xs"
            color="secondary"
            className="leading-5 whitespace-pre-wrap"
          >
            {noteText}
          </Text>
        <div className="group-hover:flex items-center gap-2 hidden mt-1">
          <NoteTypeSheet data={data} id={id}>
            <EditIcon className="w-3 h-3 cursor-pointer" />
          </NoteTypeSheet>
          <DeleteIcon
            className="w-3 h-3 cursor-pointer text-red-500"
            onClick={() => deleteNode?.(id)}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteType;
