import { Document, Model, Schema, model, models, ObjectId } from "mongoose";

interface IPasswordResetLog extends Document {
  email: string;
  user_id: ObjectId;
  created_at: Date;
}

type PasswordResetLogModel = Model<IPasswordResetLog>;

const PasswordResetLogModelSchema = new Schema<
  IPasswordResetLog,
  PasswordResetLogModel
>({
  email: { type: Schema.Types.String },
  user_id: { type: Schema.Types.ObjectId },
  created_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.password_reset_log ||
  model<IPasswordResetLog>("password_reset_log", PasswordResetLogModelSchema);
