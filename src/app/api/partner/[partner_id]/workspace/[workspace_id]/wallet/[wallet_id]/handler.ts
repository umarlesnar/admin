import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import businessWalletSchema from "@/models/business-wallet-schema";
import { yupWalletSchema } from "@/validation-schema/api/yup-wallet-schema";
import transactionModleSchema from "@/models/transaction-modle-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const wallet_id = params?.wallet_id;
      
      const Wallet = await businessWalletSchema.findOne({
        _id: wallet_id,
      });

      if (!Wallet) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Wallet Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: Wallet,
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
    let WalletValidateBody: any = {};
    const wallet_id = params?.wallet_id;

    // Step 1: Validate input
    try {
      WalletValidateBody = yupWalletSchema.validateSync(body);
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

    // Step 2: Find and update wallet
    try {
      const existingWallet = await businessWalletSchema.findOne({
        _id: wallet_id,
        workspace_id: params?.workspace_id,
      });

      if (!existingWallet) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            message: "Wallet Not Found",
            data: { wallet_type: "Wallet Not found" },
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const rechargeAmount = WalletValidateBody?.credit_balance || 0;
      const walletType = WalletValidateBody?.wallet_type === "CREDIT" ? "CREDIT" : "DEBIT";

      const updatedWallet = await businessWalletSchema.findOneAndUpdate(
        { _id: wallet_id },
        {
          $inc: {
            credit_balance: walletType === "CREDIT" ? rechargeAmount : -rechargeAmount,
          },
        },
        { new: true }
      );

      await transactionModleSchema.create({
        name: "Wallet Update",
        action: "INSERT",
        type: walletType,
        value: rechargeAmount,
        reference_type: "ADMIN",
        workspace_id: params?.workspace_id,
        business_id: existingWallet.business_id,
        created_at: Date.now(),
      });

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Wallet updated successfully",
          data: updatedWallet,
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
