import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IIgAutomateSession extends Document {
  business_id: Schema.Types.ObjectId;
  workspace_id: Schema.Types.ObjectId;
  automation_id: Schema.Types.ObjectId;
  type: Schema.Types.String;
  status: Schema.Types.String;
  created_at: Date;
  created_by: Schema.Types.ObjectId;
}

interface IIGAutomateSessionMethods {}

type IIgAutomateSessionModel = Model<
  IIgAutomateSession,
  IIGAutomateSessionMethods
>;

const AutomateFlowSessionSchema = new Schema<
  IIgAutomateSession,
  IIGAutomateSessionMethods,
  IIgAutomateSessionModel
>({
  business_id: { type: Types.ObjectId },
  workspace_id: { type: Types.ObjectId },
  automation_id: { type: Types.ObjectId },
  type: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "PENDING" },
  created_at: { type: Schema.Types.Date, default: Date.now },
  created_by: { type: Types.ObjectId },
});

export default models.ig_automation_session ||
  model<IIgAutomateSession>("ig_automation_session", AutomateFlowSessionSchema);
