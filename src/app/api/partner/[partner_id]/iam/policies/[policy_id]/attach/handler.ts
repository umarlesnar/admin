import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import policiesModelSchema from "@/models/policies-model-schema";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const policy_id = params?.policy_id;

      const policy = await policiesModelSchema.findOne({
        _id: policy_id,
      });

      if (!policy) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Policy Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const businessAccounts = await businessAccountModelSchema.find(
        { policy_id: policy_id },
        { name: 1, _id: 1 }
      );

      const businessData = businessAccounts.map((account) => ({
        name: account.name,
        business_id: account._id,
      }));

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: {
            policy,
            business_accounts: businessData,
          },
          message: "Success",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
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

  .post(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const body = await req.json();
      const policy_id = params?.policy_id;
      const business_id = body?.business_id;

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

      if (!business_id) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Business ID is required",
            data: { business_id: "Business ID is missing" },
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const policyExists = await policiesModelSchema.findById(policy_id);
      if (!policyExists) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            message: "Policy not found",
            data: null,
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const businessExists = await businessAccountModelSchema.findById(
        business_id
      );
      if (!businessExists) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            message: "Business not found",
            data: null,
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      if (businessExists.policy_id?.toString() === policy_id) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "This policy is already assigned to this business",
            data: { policy_id: "Duplicate assignment is not allowed" },
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      await businessAccountModelSchema.updateOne(
        { _id: business_id },
        { $set: { policy_id } }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Policy successfully attached to business",
          data: { business_id, policy_id },
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      console.error("Error attaching policy to business:", error);
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

router.delete(async (req: AppNextApiRequest, { params }: any) => {
  try {
    const body = await req.json();
    const policy_id = params?.policy_id;
    const business_id = body?.business_id;

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

    if (!business_id) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Business ID is required",
          data: { business_id: "Business ID is missing" },
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    const businessExists = await businessAccountModelSchema.findById(
      business_id
    );
    if (!businessExists) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
          message: "Business not found",
          data: null,
        },
        { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
      );
    }

    await businessAccountModelSchema.updateOne(
      { _id: business_id },
      { $unset: { policy_id: "" } }
    );

    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
        message: "Policy removed from business and deleted successfully",
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
