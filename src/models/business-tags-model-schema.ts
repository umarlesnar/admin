import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IBusinessTag extends Document {
  business_id: Types.ObjectId;
  tags: Schema.Types.Mixed;
}

type businessTagModel = Model<IBusinessTag>;

const businessTagModalSchema = new Schema<IBusinessTag, businessTagModel>({
  business_id: { type: Schema.Types.ObjectId },
  tags: { type: Schema.Types.Mixed },
});

export default models.tags ||
  model<IBusinessTag>("tags", businessTagModalSchema);
