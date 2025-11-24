import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IAutomateFlowSession extends Document {
  workspace_id: Schema.Types.ObjectId;
  business_id: Schema.Types.ObjectId;
  flow_id: Schema.Types.ObjectId;
  cs_id: Schema.Types.ObjectId;
  flow_node_id: string;
  flow_last_node_id: string;
  flow_variables: Schema.Types.Mixed;
  flow_retry_count: number;
  created_at: Date;
}

interface IAutomateFlowSessionMethods {}

type IAutomateFlowSessionModel = Model<
  IAutomateFlowSession,
  IAutomateFlowSessionMethods
>;

const AutomateFlowSessionSchema = new Schema<
  IAutomateFlowSession,
  IAutomateFlowSessionMethods,
  IAutomateFlowSessionModel
>({
  workspace_id: { type: Types.ObjectId, required: true },
  business_id: { type: Types.ObjectId, required: true },
  flow_id: { type: Types.ObjectId, required: true },
  cs_id: { type: Types.ObjectId, required: true },
  flow_node_id: { type: String, required: true },
  flow_last_node_id: { type: String, required: true },
  flow_variables: { type: Schema.Types.Mixed, required: true },
  flow_retry_count: { type: Number, required: true },
  created_at: { type: Date, required: true },
});
export default models.automate_flow_session ||
  model<IAutomateFlowSession>(
    "automate_flow_session",
    AutomateFlowSessionSchema
  );
