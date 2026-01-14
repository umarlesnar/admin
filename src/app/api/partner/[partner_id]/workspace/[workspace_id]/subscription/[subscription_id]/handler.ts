import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import subscriptionSchema from "@/models/subscription-schema";
import moment from "moment";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();
    const subscription_id = params?.subscription_id;

    // Step 1: basic validation / assignment
    let SubscriptionDateValidateBody: any = {};
    try {
      SubscriptionDateValidateBody = body;
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Body validation error",
          data: errorObj,
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    try {
      // Step 2: Get existing subscription to check payment_gateway
      const existingSubscription = await subscriptionSchema.findById(
        subscription_id
      );

      if (!existingSubscription) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            message: "Subscription not found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      // Helper function to convert date to Unix timestamp
      const convertToUnixTimestamp = (dateValue: any) => {
        if (!dateValue) return null;
        // If value is > 10 billion, it's already in milliseconds
        const dateInMs = dateValue > 10000000000 ? dateValue : dateValue * 1000;
        return Math.floor(moment(dateInMs).endOf("day").valueOf() / 1000);
      };

      // Step 3: build update fields based on payment_gateway
      const updateFields: Record<string, any> = {};

      if (existingSubscription.payment_gateway === "razorpay") {
        // For razorpay: only update r_current dates, exclude r_start_at and r_end_at
        for (const key in SubscriptionDateValidateBody) {
          if (
            key !== "r_start_at" &&
            key !== "r_end_at" &&
            SubscriptionDateValidateBody[key] !== undefined &&
            SubscriptionDateValidateBody[key] !== null
          ) {
            updateFields[key] = SubscriptionDateValidateBody[key];
          }
        }

        // Map r_start_at to r_current_start_at and r_end_at to r_current_end_at
        if (
          SubscriptionDateValidateBody.r_start_at !== undefined &&
          SubscriptionDateValidateBody.r_start_at !== null
        ) {
          updateFields.r_current_start_at = Math.floor(
            SubscriptionDateValidateBody.r_start_at
          );
        }
        if (
          SubscriptionDateValidateBody.r_end_at !== undefined &&
          SubscriptionDateValidateBody.r_end_at !== null
        ) {
          updateFields.r_current_end_at = convertToUnixTimestamp(
            SubscriptionDateValidateBody.r_end_at
          );
        }
      } else if (existingSubscription.payment_gateway === "manual") {
        // For manual: update all fields including both current and regular dates
        for (const key in SubscriptionDateValidateBody) {
          if (
            SubscriptionDateValidateBody[key] !== undefined &&
            SubscriptionDateValidateBody[key] !== null
          ) {
            updateFields[key] = SubscriptionDateValidateBody[key];
          }
        }

        // Also update current dates
        if (
          SubscriptionDateValidateBody.r_start_at !== undefined &&
          SubscriptionDateValidateBody.r_start_at !== null
        ) {
          updateFields.r_current_start_at = Math.floor(
            SubscriptionDateValidateBody.r_start_at
          );
        }
        if (
          SubscriptionDateValidateBody.r_end_at !== undefined &&
          SubscriptionDateValidateBody.r_end_at !== null
        ) {
          updateFields.r_current_end_at = convertToUnixTimestamp(
            SubscriptionDateValidateBody.r_end_at
          );
        }
      } else {
        for (const key in SubscriptionDateValidateBody) {
          if (
            SubscriptionDateValidateBody[key] !== undefined &&
            SubscriptionDateValidateBody[key] !== null
          ) {
            updateFields[key] = SubscriptionDateValidateBody[key];
          }
        }
      }

      const updatedSubscription = await subscriptionSchema.findOneAndUpdate(
        { _id: subscription_id },
        { $set: updateFields },
        { new: true }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Subscription updated successfully",
          data: updatedSubscription,
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      console.error("Error updating subscription:", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server error",
          data: error,
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    }
  });

export default router;
