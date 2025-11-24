import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import policiesModelSchema from "@/models/policies-model-schema";
import {
  yupPoliciesSchema,
  yupPoliciesSortQuery,
} from "@/validation-schema/api/yup-policies-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const { partner_id } = params;

    // Step 1: Fetch partner by ID to get domain
    const partner = await partnersModelSchema.findById(partner_id);
    if (!partner) {
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Invalid partner ID",
          data: {},
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    const query = await getServerSearchParams(req);

    let PoliciesQueryValidation: any = {};
    try {
      PoliciesQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    let searchQuery: any = {};

    if (PoliciesQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            name: {
              $regex: `.*${PoliciesQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            description: {
              $regex: `.*${PoliciesQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (PoliciesQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        PoliciesQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (PoliciesQueryValidation.sort != "") {
      const _lstry: any = PoliciesQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupPoliciesSortQuery.validateSync(sortObj);
      } catch (error) {
        sortQuery = { created_at: -1 };
      }
    } else {
      sortQuery = { created_at: -1 };
    }

    let finalFilterQuery = {
      domain: partner.domain,
      ...searchQuery,
      ...filterQuery,
    };

    const finalResponse: any = {
      per_page: PoliciesQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: PoliciesQueryValidation.page,
    };

    const totalCount = await policiesModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      PoliciesQueryValidation.page > 0
        ? (PoliciesQueryValidation.page - 1) * PoliciesQueryValidation.per_page
        : 0;
    let policies = await policiesModelSchema
      .find(finalFilterQuery)
      // .select("_id name description type status created_at updated_at")
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = policies;
    return NextResponse.json({
      data: finalResponse,
    });
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let PoliciesValidateBody: any = {};

    //step 1
    try {
      PoliciesValidateBody = yupPoliciesSchema.validateSync(body);
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Body Validation Error",
          data: errorObj,
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    //step 2

    try {
      const alreadyExist = await policiesModelSchema.findOne({
        name: PoliciesValidateBody?.name,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              name: "policies Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const newpolicies = new policiesModelSchema({
        ...PoliciesValidateBody,
      });

      await newpolicies.save();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newpolicies,
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
