import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IRabbitmqUser extends Document {
  _id: String;
  status: String;
  response_body: String;
  tag: String;
  password: String;
  expired_at: Date;
  created_at: Date;
}

type RabbitmqUserModel = Model<IRabbitmqUser>;

const RabbitmqUserModelSchema = new Schema<IRabbitmqUser, RabbitmqUserModel>(
  {
    _id: { type: String, required: true },
    status: { type: Schema.Types.Mixed },
    tag: { type: Schema.Types.Mixed },
    response_body: { type: Schema.Types.Mixed },
    password: { type: String },
    expired_at: { type: Date },
    created_at: { type: Schema.Types.Date, default: new Date() },
  },
  { collection: "rabbitmq_backend" }
);

RabbitmqUserModelSchema.index({ expired_at: 1 }, { expireAfterSeconds: 0 });
export default models.rabbitmq_backend ||
  model<IRabbitmqUser>("rabbitmq_backend", RabbitmqUserModelSchema);
