import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IFlowLibrary extends Document {
  name: Schema.Types.String;
  nodes: Schema.Types.Mixed;
  description: Schema.Types.String;
  edges: Schema.Types.Mixed;
  status: Schema.Types.String;
  industry: string;
  use_case: string;
  created_at: Date;
  updated_at: Date;
  created_by: Schema.Types.ObjectId;
}

interface IFlowLibraryMethods {}

type IFlowLibraryModel = Model<IFlowLibrary, IFlowLibraryMethods>;

const FlowLibrarySchema = new Schema<
  IFlowLibrary,
  IFlowLibraryMethods,
  IFlowLibraryModel
>({
  
  name: { type: Schema.Types.String },
  nodes: { type: Schema.Types.Mixed },
  edges: { type: Schema.Types.Mixed },
  description: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "ENABLED" },
  industry: { type: String },
  use_case: { type: String },
  created_at: { type: Schema.Types.Date, default: new Date() },
  created_by: { type: Types.ObjectId },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.bot_flow_library ||
  model<IFlowLibrary>("bot_flow_library", FlowLibrarySchema);
