import { Document, Model, Schema, model, models, Types } from "mongoose";

interface IAddon extends Document {
  code: String;
  name: String;
  description: String;
  category: String;
  billing_type: String;
  price_per_month: Number;
  price_per_unit: Number;
  unit_name: String;
  default_limit: Number;
  config: Schema.Types.Mixed;
  is_public: Boolean;
}

type AddonModel = Model<IAddon>;

const AddonModelSchema = new Schema<IAddon, AddonModel>({
  code: { type: String, unique: true },
  name: String,
  description: String,
  category: {
    type: String,
    enum: ["AI", "Storage", "Integration", "Workspace"],
  },
  billing_type: { type: String, enum: ["flat", "usage", "free"] },
  price_per_month: Number,
  price_per_unit: Number,
  unit_name: String, // e.g., "GB", "messages"
  default_limit: Number,
  config: Schema.Types.Mixed, // JSON blob for extra dynamic flags
  is_public: { type: Boolean, default: true }, // for marketplace visibility
});

// AddonModelSchema.index({ workspace: 1, addon: 1 }, { unique: true });

export default models.addon || model<IAddon>("addon", AddonModelSchema);
