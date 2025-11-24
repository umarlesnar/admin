import { useEffect } from "react";
import { Handle, useUpdateNodeInternals } from "react-flow-renderer";

const WorkflowCustomHandle = ({
  nodeId,
  id,
  idx,
  handleIndex,
  ...props
}: any) => {
  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => {
    updateNodeInternals(nodeId);
  }, [nodeId, updateNodeInternals, handleIndex, id]);

  return <Handle id={id} style={{ left: 10 + idx * 20 }} {...props} />;
};

export default WorkflowCustomHandle;
