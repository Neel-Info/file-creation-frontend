import { Button } from "@chakra-ui/react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/campaigns");
}
