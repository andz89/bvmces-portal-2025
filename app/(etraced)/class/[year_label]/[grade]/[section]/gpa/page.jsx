"use server";
import React from "react";

export default async function Page({ params, searchParams }) {
  const { section } = await params;
  const { id } = await searchParams;
  const { year_label } = await params;
  const { grade } = await params;
  return <div>GPA</div>;
}
