import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import workspaceModelSchema from "@/models/workspace-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);
    let businessQueryValidation: any = {};
    try {
      businessQueryValidation = yupFilterQuerySchema.validateSync(query);
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

      if (businessQueryValidation.q != "") {
        searchQuery = {
          $or: [
            {
              name: {
                $regex: `.*${businessQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (businessQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          businessQueryValidation.filter
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
        per_page: businessQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: businessQueryValidation.page,
      };

      const totalCount = await businessAccountModelSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
        businessQueryValidation.page > 0
          ? (businessQueryValidation.page - 1) *
            businessQueryValidation.per_page
          : 0;
      let business = await businessAccountModelSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);

      finalResponse.items = business;

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
    try {
      const workspace_id = params?.workspace_id;
      const body = await req.json();

      if (!workspace_id || !body?.name) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "workspace_id and name are required",
            data: null,
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const workspace = await workspaceModelSchema.findOne({
        _id: workspace_id,
      });

      if (!workspace) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: {
              workspace: "workspace not found",
            },
            message: "workspace not found",
          },
          { status: SERVER_STATUS_CODE.SUCCESS_CODE }
        );
      }

      const businessExist = await businessAccountModelSchema.findOne({
        workpsace_id: workspace_id,
        phone_number_id: body.phone_number_id,
      });

      if (businessExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Phone Number already exist",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const newBusiness = await businessAccountModelSchema.create({
        ...body,
        channel_type: "WHATSAPP",
        domain: workspace.domain,
        workspace_id,
      });

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: newBusiness,
          message: "Business created successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      console.error("Error creating business", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server Error",
          data: error,
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    }
  });

export default router;