import React from "react";
import AdminCardSection2 from "./admin-dashboard/AdminCardSection2";
import TableSection from "./admin-dashboard/TableSection";
import BreadcrumSection from "./admin-dashboard/BreadcrumSection";
import ChartSection1 from "./admin-dashboard/ChartSection1";
import ChartSection2 from "./admin-dashboard/ChartSection2";

export default function Dashboard() {
  return (
    <>
      <BreadcrumSection />
      <AdminCardSection2 />
      <ChartSection1 />
      <TableSection />
      <ChartSection2 />
    </>
  );
}
