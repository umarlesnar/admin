import { useUserLoginQuery } from "@/framework/dashboard/recent/get-user-login-activity";
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
import moment from "moment";

const tableHeaders = [
  "User ID",
  "Login Date",
  // "IP Address",
  "Status",
];

const UserLoginActivity = () => {
  const { data, isLoading } = useUserLoginQuery({});

  return (
    <div
      className={classNames(
        "shadow-lg rounded-xl p-4 transition-colors duration-300",
        isLoading ? "bg-gray-100" : "bg-white"
      )}
    >
      <Text size="xl" weight="semibold" color="primary">
        User Login Activity
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
                    <Text>{item.user_id ? item.user_id : "---"}</Text>
                  </TableCell>
                  <TableCell>
                    <Text>
                      {moment(item.login_time).format("DD-MM-YYYY - hh-mm A")}
                    </Text>
                  </TableCell>
                  {/* <TableCell>
                    <Text>{item.ip_address}</Text>
                  </TableCell> */}
                  <TableCell>
                    <span
                      className={classNames(
                        " rounded-md text-sm font-medium",
                        item.status === "SUCCESS"
                          ? "bg-green-100 px-2 py-1 text-green-700"
                          : "bg-red-100 px-3 py-1 text-red-700"
                      )}
                    >
                      {item.status}
                    </span>
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

export default UserLoginActivity;
