import { Document, Schema, Types, Model, model, models } from "mongoose";
interface IBroadcast extends Document {
  business_id?: Types.ObjectId;
  name: Schema.Types.String;
  template_name: Schema.Types.String;
  type: Schema.Types.Number;
  template_id: Schema.Types.String;
  template_variables: Schema.Types.Mixed;
  contact_ids: Schema.Types.Array;
  schedule_type: Schema.Types.String;
  schedule_datetime: Schema.Types.String;
  wba_variables: any;
  status: Schema.Types.String;
  created_at: Schema.Types.String;
  updated_at: Schema.Types.String;
  created_by: Schema.Types.String;
  success_count: Schema.Types.Number;
  read_count: Schema.Types.Number;
  replied_count: Schema.Types.Number;
  recipients_count: Schema.Types.Number;
  failed_count: Schema.Types.Number;
  queue_id: Schema.Types.Mixed;
  wba_template_header: Schema.Types.Mixed;
}
interface IBroadcastMethods {}
type BroadcastModel = Model<IBroadcast, IBroadcastMethods>;
const BroadcastSchema = new Schema<
  IBroadcast,
  IBroadcastMethods,
  BroadcastModel
>({
  template_name: { type: Schema.Types.String, required: true },
  business_id: { type: Types.ObjectId, required: true },
  type: { type: Schema.Types.Number, default: 0 },
  name: { type: Schema.Types.String, required: true },
  template_id: { type: Schema.Types.ObjectId, required: true },
  template_variables: { type: Schema.Types.Mixed },
  contact_ids: { type: Schema.Types.Array, default: [] },
  schedule_type: { type: Schema.Types.String, default: "NOW" },
  schedule_datetime: { type: Schema.Types.Date },
  wba_variables: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.String, default: "PENDING" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },
  created_by: { type: Schema.Types.ObjectId, required: true },
  success_count: { type: Schema.Types.Number, default: 0 },
  read_count: { type: Schema.Types.Number, default: 0 },
  replied_count: { type: Schema.Types.Number, default: 0 },
  recipients_count: { type: Schema.Types.Number, default: 0 },
  failed_count: { type: Schema.Types.Number, default: 0 },
  queue_id: { type: Types.ObjectId },
  wba_template_header: { type: Schema.Types.Mixed, default: null },
});
export default models.automate_broadcasts ||
  model<IBroadcast>("automate_broadcasts", BroadcastSchema);
