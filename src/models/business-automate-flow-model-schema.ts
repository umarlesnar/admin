import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IAutomateFlow extends Document {
  business_id: Schema.Types.ObjectId;
  name: Schema.Types.String;
  trigger_count: number;
  step_finished_count: number;
  finished_count: number;
  nodes: Schema.Types.Mixed;
  edges: Schema.Types.Mixed;
  status: Schema.Types.String;
  bot_access_token: string;
  created_at: Date;
  updated_at: Date;
  created_by: Schema.Types.ObjectId;
}

interface IAutomateFlowMethods {}

type IAutomateFlowModel = Model<IAutomateFlow, IAutomateFlowMethods>;

const AutomateFlowSchema = new Schema<
  IAutomateFlow,
  IAutomateFlowMethods,
  IAutomateFlowModel
>({
  business_id: { type: Types.ObjectId, required: true },
  name: { type: Schema.Types.String },
  bot_access_token: { type: Schema.Types.String },
  nodes: { type: Schema.Types.Mixed },
  edges: { type: Schema.Types.Mixed },
  finished_count: { type: Schema.Types.Number, default: 0 },
  trigger_count: { type: Schema.Types.Number, default: 0 },
  step_finished_count: { type: Schema.Types.Number, default: 0 },
  status: { type: Schema.Types.String, default: "ENABLED" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  created_by: { type: Types.ObjectId, required: true },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.automate_flow ||
  model<IAutomateFlow>("automate_flow", AutomateFlowSchema);
