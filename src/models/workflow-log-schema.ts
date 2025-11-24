import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
} from "mongoose";

/*
{
  "workflow_id":"98jalsjdjasd",
  "response_type":"workflow",
  "response_data":"Shopify Cart",
  "response_agent":["ecommerce"],
  "start_node_id":"whatsapp",
  "next_node_id":"98jalsjdjasd",
  "next_node_id":"aksjdkakjsh",
  "node_state":"Optional",
  "status":"PENDING | PROCESSING | SHCEDULED | RESUMED | DELETED",
  
  "last_updated":"asdkjaksjd",
  "created_at":"asdkjaksjd",
}
*/

interface IWorkflowLog extends Document {
  workflow_id: ObjectId;
  response_type: String;
  response_data: String;
  response_agent: String;
  start_node_id: String;
  next_node_id: String;
  node_state: any;
  status: String;
  queue_id: ObjectId;
  last_updated: Number;
  created_at: Number;
}

interface IWorkflowLogMethods {}

type WorkflowLogModel = Model<IWorkflowLog, {}, IWorkflowLogMethods>;

const WorkflowLogModelSchema = new Schema<
  IWorkflowLog,
  WorkflowLogModel,
  IWorkflowLogMethods
>({
  workflow_id: { type: Types.ObjectId },
  response_type: { type: String },
  response_data: { type: Schema.Types.Mixed },
  response_agent: { type: String },
  start_node_id: { type: String },
  next_node_id: { type: String },
  node_state: { type: Schema.Types.Mixed },
  status: { type: String },
  queue_id: { type: Types.ObjectId },
  last_updated: { type: Schema.Types.Number },
  created_at: { type: Schema.Types.Number },
});

export default models.workflow_log ||
  model<IWorkflowLog>("workflow_log", WorkflowLogModelSchema);
