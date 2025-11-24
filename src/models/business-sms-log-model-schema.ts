import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IBusinessSmsLog extends Document {
  business_id?: Types.ObjectId;
  template_id: Schema.Types.String;
  mobile_number: Schema.Types.Number;
  payload: Schema.Types.Mixed;
  status: Schema.Types.String;
  type: Schema.Types.String;
  source: Schema.Types.String;
  api_response: Schema.Types.Mixed;
  webhook_config: Schema.Types.Mixed;
  created_at: Date;
  updated_at: Date;
}
interface IBusinessSmsLogMethod {}
type BusinessSmsLogModel = Model<IBusinessSmsLog, IBusinessSmsLogMethod>;
const BusinessSmsLogSchema = new Schema<
  IBusinessSmsLog,
  IBusinessSmsLogMethod,
  BusinessSmsLogModel
>({
  business_id: { type: Schema.Types.ObjectId },
  template_id: { type: Schema.Types.ObjectId },
  mobile_number: { type: Schema.Types.Mixed, required: true },
  payload: { type: Schema.Types.Mixed, default: [{}] },
  status: { type: Schema.Types.String },
  type: { type: Schema.Types.String },
  source: { type: Schema.Types.String },
  api_response: { type: Schema.Types.Mixed, default: {} },
  webhook_config: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date },
});
export default models.business_sms_log ||
  model<IBusinessSmsLog>("business_sms_log", BusinessSmsLogSchema);
