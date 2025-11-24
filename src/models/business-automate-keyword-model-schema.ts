import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IAutomateKeywordFlow extends Document {
  business_id: Schema.Types.ObjectId;
  values: Schema.Types.Mixed;
  actions: Schema.Types.Mixed;
  status: Schema.Types.String;
  created_at: Date;
  updated_at: Date;
  created_by: Schema.Types.ObjectId;
}

interface IAutomateKeywordFlowMethods {}

type IAutomateKeywordFlowModel = Model<
  IAutomateKeywordFlow,
  IAutomateKeywordFlowMethods
>;

//main schema
const AutomateKeywordFlowSchema = new Schema<
  IAutomateKeywordFlow,
  IAutomateKeywordFlowMethods,
  IAutomateKeywordFlowModel
>({
  business_id: { type: Types.ObjectId, required: true },
  values: { type: Schema.Types.Mixed },
  actions: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.String, default: "ENABLED" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  created_by: { type: Types.ObjectId, required: true },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.automate_keyword_action ||
  model<IAutomateKeywordFlow>(
    "automate_keyword_action",
    AutomateKeywordFlowSchema
  );
