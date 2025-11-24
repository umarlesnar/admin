import { Document, Model, Schema, model, models, Types } from "mongoose";
interface IUserRoles extends Document {
  name: Schema.Types.String;
  is_default: Schema.Types.Boolean;
  is_system: Schema.Types.Boolean;
  is_visible: Schema.Types.Boolean;
  permissions: Schema.Types.Mixed;
  created_at: Date;
  updated_at: Date;
}

interface IUserRolesMethods {}

type IUserRolesModel = Model<IUserRoles, IUserRolesMethods>;

const UserRolesSchema = new Schema<
IUserRoles,
IUserRolesMethods,
IUserRolesModel
>({
  name: { type: Schema.Types.String },
  is_default: { type: Schema.Types.Boolean , default: false},
  is_system: { type: Schema.Types.Boolean , default: false},
  is_visible: { type: Schema.Types.Boolean , default: true},
  permissions: { type: Schema.Types.Mixed },
  created_at: { type: Schema.Types.Date, default: new Date() },
  updated_at: { type: Schema.Types.Date, default: new Date() },

});

export default models.user_roles ||
  model<IUserRolesModel>("user_roles", UserRolesSchema);
