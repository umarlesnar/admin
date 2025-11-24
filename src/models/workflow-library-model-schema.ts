import {
    Document,
    Model,
    Schema,
    model,
    models,
    Types,
    ObjectId,
  } from "mongoose";
  
  
  interface IWorkflowlibrary extends Document {
    uuid: String;
    name: String;
    type: String;
    tags: String;
    description: String;
    platform: String;
    template_id: ObjectId;
    access_token: String;
    secret_key: any;
    start_node_id: String;
    industry: string;
    use_case: string;
    nodes: any;
    edges: any;
    status: String;
    last_report_at: Number;
    created_at: Date;
    updated_at: Date;
    created_by: ObjectId;
  }
  
  interface IWorkflowlibraryMethods {}
  
  type WorkflowlibraryModel = Model<IWorkflowlibrary, {}, IWorkflowlibraryMethods>;
  
  const WorkflowLibraryModelSchema = new Schema<
    IWorkflowlibrary,
    WorkflowlibraryModel,
    IWorkflowlibraryMethods
  >({
    uuid: { type: String },
    name: { type: String },
    type: { type: String },
    tags: [{ type: String }],
    description: { type: String },
    platform: { type: String },
    template_id: { type: Types.ObjectId },
    access_token: { type: String },
    secret_key: { type: String },
    start_node_id: { type: String },
    nodes: { type: Schema.Types.Mixed },
    edges: { type: Schema.Types.Mixed },
    industry: { type: String },
    use_case: { type: String },
    status: { type: String },
    last_report_at: { type: Schema.Types.Number },
    created_at: { type: Schema.Types.Date, default: new Date() },
    updated_at: { type: Schema.Types.Date, default: new Date() },
    created_by: { type: Schema.Types.ObjectId },
  });
  
  export default models.workflow_library ||
    model<IWorkflowlibrary>("workflow_library", WorkflowLibraryModelSchema);
  