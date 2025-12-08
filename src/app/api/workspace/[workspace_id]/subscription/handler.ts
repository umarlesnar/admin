import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import subscriptionSchema from "@/models/subscription-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import workspaceModelSchema from "@/models/workspace-model-schema";
import productItemModelSchema from "@/models/product-item-model-schema";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import paymentInvoiceSchema from "@/models/payment-invoice-schema";
import workspaceModulesModelSchema from "@/models/workspace-modules-model-schema";
import masterModulesModuleSchema from "@/models/master-modules-module-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);
    let subscriptionQueryValidation: any = {};
    try {
      subscriptionQueryValidation = yupFilterQuerySchema.validateSync(query);
    } catch (error) {
      let ErrorFormObject = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: ErrorFormObject,
          message: " ",
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    try {
      let searchQuery: any = {};

      if (subscriptionQueryValidation.q != "") {
        searchQuery = {
          $or: [
            {
              plan_name: {
                $regex: `.*${subscriptionQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (subscriptionQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          subscriptionQueryValidation.filter
        );

        const filteredObject = _omitBy(originalFilterObj, _isEmpty);

        filterQuery = filteredObject;
      }

      let sortQuery: any = { r_end_at: -1 };

      let finalFilterQuery = {
        workspace_id: params.workspace_id,
        ...searchQuery,
        ...filterQuery,
      };

      const finalResponse: any = {
        per_page: subscriptionQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: subscriptionQueryValidation.page,
      };

      const totalCount = await subscriptionSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
        subscriptionQueryValidation.page > 0
          ? (subscriptionQueryValidation.page - 1) *
            subscriptionQueryValidation.per_page
          : 0;
      let subscriptions = await subscriptionSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);

      finalResponse.items = subscriptions;

      return NextResponse.json({
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: finalResponse,
        message: "Success",
      });
    } catch (error) {
      console.log("SERVER_ERROR", error);

      return NextResponse.json({
        status: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Server Error",
      });
    }
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();
    const workspace_id = params?.workspace_id;
    let validatedBody: any = {};

    try {
      validatedBody = body;
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "body validation error",
          data: errorObj,
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    try {
      const activeSubscriptionExist = await subscriptionSchema.findOne({
        workspace_id: workspace_id,
        status: "active",
      });

      if (activeSubscriptionExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Active subscription already exist",
            data: null,
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

       // Automatically assign r_current_start_at and r_current_end_at
    // from r_start_at and r_end_at
    if (validatedBody.r_start_at) {
      validatedBody.r_current_start_at = validatedBody.r_start_at;
    }
    
    if (validatedBody.r_end_at) {
      validatedBody.r_current_end_at = validatedBody.r_end_at;
    }

    // Now validate the dates (including the auto-assigned current dates)
    if (validatedBody.r_current_end_at <= validatedBody.r_current_start_at) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "endDate must be greater than startDate.",
          data: {
            r_current_end_at: "endDate must be greater than startDate.",
          },
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

      const planExist = await productItemModelSchema.findOne({
        _id: validatedBody.plan_id,
      });

      if (!planExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            message: "Plan Not Found",
            data: {
              plan_id: "Plan Not Found",
            },
          },
          {
            status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
          }
        );
      }

      const newSubscription = new subscriptionSchema({
        workspace_id: workspace_id,
        plan_type: planExist.plan_type,
        plan_name: planExist.type
          ? `${planExist.name} (${planExist.type})`
          : `${planExist.name}`,
        policy_id: planExist.policy_id,
        total_amount: planExist?.total_price || planExist.price,
        ...validatedBody,
      });

      await newSubscription.save();

      const newPayment = new paymentInvoiceSchema({
        workspace_id: workspace_id,
        type: newSubscription.plan_type,
        plan: `${newSubscription.plan_name}`,
        payment_method: "Manual",
        currency: planExist.currency_code,
        total_price: planExist?.total_price,
        total_tax: planExist.tax,
        status: "paid",
        discount: planExist.discount_value,
        basic_price: planExist.total_price,
      });

      await newPayment.save();

      const updateWorkspace = await workspaceModelSchema.updateOne(
        {
          _id: workspace_id,
        },
        {
          subscription_id: newSubscription._id,
          policy_id: planExist.policy_id,
          type: planExist.plan_type,
          nodes_available: planExist.nodes_access,
        }
      );

      if (planExist.included_modules && planExist.included_modules.length > 0) {
        const workspaceModulesPromises = planExist.included_modules.map(
          async (module_id: string) => {
            // Get config from master modules schema
            const masterModule = await masterModulesModuleSchema.findOne({
              module_id: module_id,
            });

            // Convert config array to object
            const configObject =
              masterModule?.config && Array.isArray(masterModule.config)
                ? masterModule.config.reduce((obj: any, configKey: string) => {
                    obj[configKey] = "";
                    return obj;
                  }, {})
                : {};

            const newWorkspaceModule = new workspaceModulesModelSchema({
              workspace_id: workspace_id,
              module_id: module_id,
              enabled: true,
              source: "plan",
              config: configObject,
            });
            return newWorkspaceModule.save();
          }
        );

        await Promise.all(workspaceModulesPromises);
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Subscription Created Successfully",
          data: {
            subscription_id: newSubscription._id,
          },
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.log("Error", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server Error",
          data: error,
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });

export default router;
