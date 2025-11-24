import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import userAccountModelSchema from "@/models/user-account-model-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { yupUserAccountSchema } from "@/validation-schema/api/yup-user-account-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const user_account_id = params?.user_account_id;

      const useraccount = await userAccountModelSchema.findOne({
        _id: user_account_id,
      });

      if (!useraccount) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "User Account Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: useraccount,
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

    let userAccountValidateBody: any = {};
    const user_account_id = params?.user_account_id;

    try {
      userAccountValidateBody = yupUserAccountSchema.validateSync(body);
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

    try {
      // const alreadyExist = await userAccountModelSchema.findOne({
      //   _id: { $ne: user_account_id },
      // });

      // if (alreadyExist) {
      //   return NextResponse.json(
      //     {
      //       status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
      //       message: "Validation Error",
      //       data: {
      //         name: "User Account Already Exist",
      //       },
      //     },
      //     {
      //       status: SERVER_STATUS_CODE.SUCCESS_CODE,
      //     }
      //   );
      // }

      const updateUserAccount = await userAccountModelSchema.findOneAndUpdate(
        {
          _id: user_account_id,
        },
        {
          ...userAccountValidateBody,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: updateUserAccount,
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
  })
  .delete(async (req: AppNextApiRequest, { params }: any) => {
    const user_account_id = params?.user_account_id;

    try {
      const useraccount = await userAccountModelSchema.findOne({
        _id: user_account_id,
      });

      if (!useraccount) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "User Account Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const updateUserAccount = await userAccountModelSchema.deleteOne({
        _id: user_account_id,
      });

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: null,
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
