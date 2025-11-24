import { Document, Model, Schema, model, models, Types } from "mongoose";

export interface AppLogo {
  url: string;
  css_class: string;
}
export interface AppHeader {
  logo: AppLogo;
}

export interface AppFooter {
  copyrights: string;
  privacy_policy: string;
  terms_condition: string;
}

export interface AppSite {
  brand_name: string;
  display_name: string;
  header: AppHeader;
  footer: AppFooter;
}
export interface AppIntegration {
  subscription: boolean;
  facebook_login: boolean;
}

interface IAppConfig extends Document {
  site: AppSite;
  integration: AppIntegration;
  default_currency: string;
  br_type: number;
}
interface IAppConfigMethods {}

type AppConfigModal = Model<IAppConfig, IAppConfigMethods>;

const AppConfigSchema = new Schema<
  IAppConfig,
  IAppConfigMethods,
  AppConfigModal
>({
  site: {
    brand_name: { type: String },
    display_name: { type: String },
    header: {
      logo: {
        url: { type: String },
        css_class: { type: String },
      },
    },
    footer: {
      copyrights: { type: String },
      privacy_policy: { type: String },
      terms_condition: { type: String },
    },
  },

  integration: {
    subscription: { type: Schema.Types.Boolean, default: false },
    facebook_login: { type: Schema.Types.Boolean, default: false },
  },
  default_currency: { type: String },
  br_type: { type: Schema.Types.Number, default: 1 },
});

export default models.app_config ||
  model<IAppConfig>("app_config", AppConfigSchema);
