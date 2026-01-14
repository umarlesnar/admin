import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Text from "@/components/ui/text";
import classNames from "classnames";
import { useBusinessAccountQuery } from "@/framework/dashboard/recent/get-business-account";
import moment from "moment";
import { EyeIcon } from "@/components/ui/icons/EyeIcon";
import { useRouter } from "next/navigation";

const tableHeaders = ["Name", "Phone Number", "Created At", "Status", "Action"];

const BusinessAccountLists = () => {
  const { data, isLoading } = useBusinessAccountQuery({});
  const router = useRouter();

  return (
    <div
      className={classNames(
        "shadow-lg rounded-xl p-4 transition-colors duration-300",
        isLoading ? "bg-gray-100" : "bg-white"
      )}
    >
      <Text size="xl" weight="semibold" color="primary">
        Business Accounts
      </Text>

      <div className="overflow-x-auto mt-4 h-[320px]">
        {isLoading ? (
          <div className="flex h-[320px] items-center justify-center py-6">
            <div className="h-8 w-8  border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableHead key={header}>
                    <Text size="sm" weight="semibold" color="secondary">
                      {header}
                    </Text>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any, index: number) => (
                <TableRow key={index} className="hover:bg-gray-100 transition">
                  <TableCell>
                    <Text>{item.name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{item.wb_status?.phone_number}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{moment(item.created_at).format("DD-MM-YYYY")}</Text>
                  </TableCell>
                  <TableCell>
                    <span
                      className={classNames(
                        "rounded-md text-sm font-medium",
                        item.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 px-3 py-1"
                          : "bg-red-100 text-red-700 px-2 py-1"
                      )}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <EyeIcon
                        className="w-5 h-5 text-blue-500 cursor-pointer"
                        onClick={() => {
                          router.push(`/app/partner/${item.partner_id}/workspace/${item.workspace_id}/workspace-overview/whatsapp/business/${item._id}/overview`);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 h-full flex items-center justify-center">
            No recent login activity found.
          </p>
        )}
      </div>
    </div>
  );
};

export default BusinessAccountLists;
