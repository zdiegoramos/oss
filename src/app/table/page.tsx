import type { Payment } from "./columns";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  return [
    { id: "728ed52f", amount: 100, status: "pending", email: "m@example.com" },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "a1b2c3d4",
      amount: 316,
      status: "success",
      email: "ken99@example.com",
    },
    {
      id: "b5c6d7e8",
      amount: 242,
      status: "success",
      email: "abe45@example.com",
    },
    {
      id: "c9d0e1f2",
      amount: 837,
      status: "processing",
      email: "monserrat44@example.com",
    },
    {
      id: "d3e4f5a6",
      amount: 874,
      status: "success",
      email: "silas22@example.com",
    },
    {
      id: "e7f8a9b0",
      amount: 721,
      status: "failed",
      email: "carmella@example.com",
    },
    {
      id: "f1a2b3c4",
      amount: 450,
      status: "success",
      email: "alice@example.com",
    },
    {
      id: "a5b6c7d8",
      amount: 234,
      status: "pending",
      email: "bob@example.com",
    },
    {
      id: "b9c0d1e2",
      amount: 567,
      status: "processing",
      email: "carol@example.com",
    },
    {
      id: "c3d4e5f6",
      amount: 890,
      status: "failed",
      email: "dave@example.com",
    },
    {
      id: "d7e8f9a0",
      amount: 123,
      status: "success",
      email: "eve@example.com",
    },
  ];
}

export default async function TablePage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 font-bold text-2xl">Payments</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
