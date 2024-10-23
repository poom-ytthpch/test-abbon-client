"use client";
import DefaultLayout from "@/components/default/layouts";
import { Skeleton } from "antd";
export default function Home() {
  return (
    <DefaultLayout>
      <div>
        <Skeleton active />
      </div>
    </DefaultLayout>
  );
}
