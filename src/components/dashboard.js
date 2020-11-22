import React from "react";
import AdminCardSection2 from "./sections/AdminCardSection2";
import TableSection from "./sections/TableSection";
import BreadcrumSection from "./sections/BreadcrumSection";
import ChartSection1 from "./sections/ChartSection1";
import ChartSection2 from "./sections/ChartSection2";

export default function Dashboard() {
  return (
    <>
      <BreadcrumSection
        breadcrumb={{ parentPath: "", parentLink: "", activePath: "" }}
      />
      <AdminCardSection2 />
      <ChartSection1 />
      <TableSection />
      <ChartSection2 />
    </>
  );
}
