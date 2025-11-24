import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import userAccountModelSchema from "@/models/user-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import workspaceUserModelSchema from "@/models/workspace-user-model-schema";
import partnersModelSchema from "@/models/partners-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const user_id = params?.user_id;
    const partner_id = params?.partner_id;

    try {
      const partner = await partnersModelSchema.findById(partner_id);
      if (!partner) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Invalid partner ID",
            data: {},
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }
      const users = await userAccountModelSchema.findOne({
        _id: user_id,
        domain: partner.domain,
      });

      if (!users) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Users Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }
      const aggregationPipeline = [
        {
          $match: {
            user_account_id: users._id,
          },
        },
        {
          $lookup: {
            from: "workspaces",
            localField: "workspace_id",
            foreignField: "_id",
            as: "workspace_info",
          },
        },
        {
          $match: {
            "workspace_info.domain": partner.domain,
          },
        },
         // Add workspace data to result
         {
            $addFields: {
              workspace: {
                $cond: {
                  if: { $gt: [{ $size: "$workspace_info" }, 0] },
                  then: {
                    _id: { $arrayElemAt: ["$workspace_info._id", 0] },
                    name: { $arrayElemAt: ["$workspace_info.name", 0] },
                    domain: { $arrayElemAt: ["$workspace_info.domain", 0] },
                  },
                  else: null,
                },
              },
            },
          },
          // Remove the temporary workspace_info field
          {
            $project: {
              workspace_info: 0,
            },
          },
      ];
      
      const hasWorkspace = await workspaceUserModelSchema.aggregate(
        aggregationPipeline,
        { allowDiskUse: true }
      );
      

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: hasWorkspace,
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
  });

export default router;
