import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IUseCase extends Document {
  name: Schema.Types.String;
  status: Schema.Types.String;
  created_at: Date;
  updated_at: Date;
  // created_by: Schema.Types.ObjectId;
}

interface IIUseCaseMethods {}

type IUseCaseModel = Model<IUseCase, IIUseCaseMethods>;

const UseCaseSchema = new Schema<IUseCase, IIUseCaseMethods, IUseCaseModel>({
  name: { type: Schema.Types.String },
  status: { type: Schema.Types.String, default: "ENABLED" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  // created_by: { type: Types.ObjectId },
  updated_at: { type: Schema.Types.Date, default: new Date() },
});

export default models.use_case || model<IUseCase>("use_case", UseCaseSchema);
