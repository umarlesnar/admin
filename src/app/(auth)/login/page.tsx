// export const dynamic = "force-dynamic";
// import { nextAuthOptions } from "@/lib/next-auth-options";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import LoginForm from "./_components/LoginForm";
// import Text from "@/components/ui/text";
// import { Metadata } from "next";
// import { KwicFullIcon } from "@/components/ui/icons/KwicFullIcon";
// import SocialMediaLogin from "./_components/SocialMediaLogin";

// export const metadata: Metadata = {
//   title: "Login",
// };

// async function LoginPage(props: any) {
//   const session = await getServerSession(nextAuthOptions);

//   if (session) {
//     redirect("/app/dashboard");
//   }

//   return (
//     <>
//       <div className="min-h-screen flex flex-col justify-center items-center bg-[#F6F9F6]">
//         <div className="mx-auto w-full max-w-5xl lg:w-[425px] bg-white py-[67px] px-[40px] rounded-[24px] border border-border-teritary h-auto">
//           <div className="flex items-center justify-center mb-3">
//             <KwicFullIcon className="w-[180px] h-[80px]" />
//           </div>
//           <div className="space-y-5">
//             <div className="space-y-6">
//               <div className="space-y-7">
//                 <Text
//                   className="text-center"
//                   weight="bold"
//                   color="secondary"
//                   size="lg"
//                 >
//                   Sign in with
//                 </Text>
//                 <SocialMediaLogin />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default LoginPage;

export const dynamic = "force-dynamic";
import { nextAuthOptions } from "@/lib/next-auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./_components/LoginForm";
import Text from "@/components/ui/text";
import { Metadata } from "next";
import { KwicFullIcon } from "@/components/ui/icons/KwicFullIcon";
import SocialMediaLogin from "./_components/SocialMediaLogin";

export const metadata: Metadata = {
  title: "Login",
};

async function LoginPage(props: any) {
  const session = await getServerSession(nextAuthOptions);

  if (session) {
    redirect("/app/dashboard");
  }

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F6F9F6]">
        <div className="mx-auto w-full max-w-sm lg:w-[425px] bg-white py-[24px] px-[32px] rounded-[24px] border border-border-teritary">
          <div className="flex items-center justify-center mb-3">
            <KwicFullIcon className="w-[108px] h-[48px]" />
          </div>
          <div className="space-y-5">
            <div className="space-y-6">
              <div className="space-y-4">
                <Text
                  className="text-center"
                  weight="bold"
                  color="secondary"
                  size="lg"
                >
                  Sign in with
                </Text>
                <SocialMediaLogin />
              </div>
              {/* <div className="w-full flex items-center justify-center ">
                  <KwicFullLogo className="mr-4" />
                </div> */}

              <div className="flex items-center ">
                <div className="flex-1 border-t border-gray-300 mt-[1px]" />
                <Text
                  className="text-center px-2"
                  weight="regular"
                  color="secondary"
                  size="sm"
                >
                  or Signin with email
                </Text>
                <div className="flex-1 border-t border-gray-300  mt-[1px]" />
              </div>
            </div>
            <div className="space-y-4">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
