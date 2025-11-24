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
  "business_id":"98jalsjdjasd",
  "type":"workflow",
  "name":"Shopify Cart",
  "tags":["ecommerce"],
  "platform":"whatsapp",
  "template_id":"98jalsjdjasd",
  "access_token":"aksjdkakjsh",
  "secret_key":"Optional",
  "status":"ACTIVE",
  "start_node_id":"asdkjaksjd",
  "nodes":[],
  "edges":[],
  "last_report_at":"Datetime"
}

*/

interface IWorkflow extends Document {
  business_id: ObjectId;
  uuid: String;
  name: String;
  type: String;
  tags: String;
  platform: String;
  template_id: ObjectId;
  access_token: String;
  secret_key: any;
  start_node_id: String;
  nodes: any;
  edges: any;
  status: String;
  last_report_at: Number;
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;
}

interface IWorkflowMethods {}

type WorkflowModel = Model<IWorkflow, {}, IWorkflowMethods>;

const WorkflowModelSchema = new Schema<
  IWorkflow,
  WorkflowModel,
  IWorkflowMethods
>({
  uuid: { type: String },
  business_id: { type: Types.ObjectId },
  name: { type: String },
  type: { type: String },
  platform: { type: String },
  template_id: { type: Types.ObjectId },
  access_token: { type: String },
  secret_key: { type: String },
  start_node_id: { type: String },
  nodes: { type: Schema.Types.Mixed },
  edges: { type: Schema.Types.Mixed },
  status: { type: String },
  last_report_at: { type: Schema.Types.Number },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
  created_by: { type: Schema.Types.ObjectId },
});

export default models.workflow ||
  model<IWorkflow>("workflow", WorkflowModelSchema);
