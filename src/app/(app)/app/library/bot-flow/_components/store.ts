import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";

type RFState = {
  name: String;
  industry: String;
  use_case: String;
  nodes: Node[];
  edges: Edge[];
  status: String;
  description: string;
  

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  variables: any[];
  setVariables: (variables: any[]) => void;
  updateNodeData?: (nodeId: string, data: any) => void;
  setNodeReuslt?: (nodeId: string, data: any) => void;
  deleteNode?: (nodeId: string) => void;
  deleteEdge?: (edgeId: string) => void;
  setNewNode?: (type: string, nodeType: string, data: any) => void;
  setStartNode?: (nodeId: string) => void;
  setInitialNode?: (data: any) => void;
  setFlowName?: (data: any) => void;
  setIndustryName?: (data: any) => void;
  setUsecaseName?: (data: any) => void;
  setFlowStatus?: (data: any) => void;
  setDescription: (description: string) => void; 
  resetStore?: () => void
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  name: "",
  industry: "",
  use_case: "",
  nodes: [],
  edges: [],
  variables: [],
  description: "",
  status: "",
  setVariables: (variables: any) => {
    set({
      variables: variables,
    });
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      // edges: addEdge(connection, get().edges),
      edges: addEdge({ ...connection, type: "buttonedge" }, get().edges),
    });
  },
  updateNodeData: (nodeId: string, payload: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = { ...node.data, ...payload };
        }

        return node;
      }),
    });
  },

  setInitialNode: (data: any) => {
    set({
      name: data?.name || "",
      industry: data?.industry || "",
      use_case: data?.use_case || "",
      status: data?.status || "",
      nodes: data?.nodes || [],
      edges: data?.edges || [],
      description: data?.description || "",
    });
  },
  setFlowName: (flowName: any) => {
    set({
      name: flowName || "",
    });
  },
  setIndustryName: (industryName: any) => {
    set({
      industry: industryName || "",
    });
  },
  setUsecaseName: (usecaseName: any) => {
    set({
      use_case: usecaseName || "",
    });
  },
  setStartNode: (nodeId: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = { ...node.data, is_start_node: true };
        } else {
          node.data = { ...node.data, is_start_node: false };
        }
        return node;
      }),
    });
  },
  setNodeResult: (nodeId: any, data: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, ...data };
        }
        return node;
      }),
    });
  },
  deleteNode: (nodeId: string) => {
    const temp_arr = get().nodes.filter((node) => {
      return node.id !== nodeId;
    });

    const edge_temp_arr = get().edges.filter((edge) => {
      if (edge.source !== nodeId && edge.target !== nodeId) {
        return true;
      }
    });

    const final_node = temp_arr.map((node) => {
      if (node.data.node_result_id == nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            node_result_id: "",
          },
        };
      } else {
        return node;
      }
    });

    set({
      nodes: [...final_node],
    });

    set({
      edges: [...edge_temp_arr],
    });
  },

  deleteEdge: (edgeId: string) => {
    const edge_temp_arr = get().edges.filter((edge) => {
      return edge.id !== edgeId;
    });

    set({
      edges: [...edge_temp_arr],
    });
  },

  setFlowStatus: (status: any) => {
    set({
      status: status || "",
    });
  },
  setDescription: (description: any) => {
    set({
      description: description || "",
    });
  },
  setNewNode: (type, nodeType, data) => {
    const temp_arr = get().nodes;

    const last_item = temp_arr.slice(-1)[0];

    let is_start_node = false;

    if (temp_arr.length == 0) {
      is_start_node = true;
    }
    if (temp_arr.length > 0) {
      temp_arr.push({
        id: nodeType + "-" + Math.random().toString(20).slice(2),
        type: type,
        data: { ...data, is_start_node: is_start_node },
        position: {
          x: last_item?.position.x + 150,
          y: last_item?.position.y - 40,
        },
      });
    } else {
      temp_arr.push({
        id: nodeType + "-" + Math.random().toString(20).slice(2),
        type: type,
        data: { ...data, is_start_node: is_start_node },
        position: { x: 50, y: 50 },
      });
    }

    set({
      nodes: [...temp_arr],
    });
  },
  resetStore: () => {
    set({
      name: "",
      industry: "",
      use_case: "",
      nodes: [],
      edges: [],
      variables: [],
      description: "",
      status: "",
    });
  },
}));

export default useStore;
