"use client";
import React, { useState } from "react";
import PolicysideNavBar from "./policySideNavBar";
import PolicyViewSheet from "./PolicyViewForm";
import BusinessPoliciesList from "./BusinessPolicyList";

type Props = {};

const PolicyViewPage = (props: Props) => {
  const [activeTab, setActiveTab] = useState("policy");
  return (
    <section
      aria-labelledby="primary-heading"
      className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
    >
      <div className="flex-grow overflow-hidden h-screen bg-scroll">
        <div className="w-full h-full flex flex-col max-w-full self-center space-y-3 py-2  sm:px-3.5 md:px-4 lg:px-2 @container min-h-full">
          <div className="w-full h-full flex-1 flex flex-col max-w-full self-center">
            <div className="flex flex-1 gap-2 w-full h-full  mr-auto overflow-auto bg-scroll">
              <PolicysideNavBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <div className="w-full flex-1 h-full bg-white rounded-md p-3">        
                  {activeTab === "policy" && <PolicyViewSheet />}
                  {activeTab === "attach" && <BusinessPoliciesList />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PolicyViewPage;
