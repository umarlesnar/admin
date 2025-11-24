import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import policiesModelSchema from "@/models/policies-model-schema";
import { yupPoliciesSchema } from "@/validation-schema/api/yup-policies-schema";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const policy_id = params?.policy_id;

      const policies = await policiesModelSchema.findOne({
        _id: policy_id,
      });

      if (!policies) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Policies Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: policies,
          message: "Success",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
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
  })
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let policiesValidateBody: any = {};
    const policy_id = params?.policy_id;
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

    //step 1
    try {
      policiesValidateBody = yupPoliciesSchema.validateSync(body);
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
        _id: { $ne: policy_id },
        name: policiesValidateBody.name,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              name: "Policies Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const updatePolicies = await policiesModelSchema.findOneAndUpdate(
        {
          _id: policy_id,
          domain: partner?.domain,
        },
        {
          ...policiesValidateBody,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: updatePolicies,
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

router.delete(async (req: AppNextApiRequest, { params }: any) => {
  const policy_id = params?.policy_id;
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

  try {
    if (!policy_id) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Policy ID is required",
          data: { policy_id: "Policy ID is missing" },
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    const policy = await policiesModelSchema.findOne({ _id: policy_id , domain: partner?.domain});

    if (!policy) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
          message: "Policy not found",
          data: null,
        },
        { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
      );
    }

    await businessAccountModelSchema.updateMany(
      { policy_id: policy_id, domain: partner?.domain },
      { $unset: { policy_id: "" } }
    );

    await policiesModelSchema.deleteOne({ _id: policy_id });

    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
        message: "Policy deleted and detached from businesses successfully",
        data: null,
      },
      { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    );
  } catch (error) {
    console.error("Error deleting policy:", error);
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
