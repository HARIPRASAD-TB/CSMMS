import { redirect } from "next/navigation";

export default function ContractorsPage() {
  redirect("/workers?tab=contractors");
}
