import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import {
  yupFilterQuerySchema,
  yupSortQuery,
} from "@/validation-schema/api/yup-common-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import subscriptionSchema from "@/models/subscription-schema";
import userAccountModelSchema from "@/models/user-account-model-schema";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

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
              name: {
                $regex: `.*${subscriptionQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              category: {
                $regex: `.*${subscriptionQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              industry: {
                $regex: `.*${subscriptionQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              use_case: {
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

      let sortQuery: any = {};

      if (subscriptionQueryValidation.sort != "") {
        const _lstry: any = subscriptionQueryValidation?.sort;
        const sortObj = getJSONObjectFromString(_lstry);

        try {
          sortQuery = yupSortQuery.validateSync(sortObj);
        } catch (error) {
          sortQuery = { r_remaining_count: -1 };
        }
      } else {
        sortQuery = { r_remaining_count: -1 };
      }

      let finalFilterQuery = {
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

      let updated_subscriptions = [];

      for (let i = 0; i < subscriptions.length; i++) {
        const element = { ...subscriptions[i]._doc };

        if (element.user_id) {
          const user = await userAccountModelSchema
            .findOne({
              _id: element.user_id,
            })
            .select("profile email phone business_id");

          if (user) {
            const business = await businessAccountModelSchema
              .findOne({
                business_id: user.business_id,
              })
              .select("name");

            element.business = business;
            element.user = user;
          } else {
            element.user = null;
          }
        } else {
          element.business = null;
          element.user = null;
        }
        updated_subscriptions.push(element);
      }

      finalResponse.items = updated_subscriptions;

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
  });

export default router;
