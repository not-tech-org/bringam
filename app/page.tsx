import Image from "next/image";
import AppLayout from "./components/AppLayout";
import Header from "./components/Header";

export default function Home() {
  return (
    <div>
      <AppLayout>
        <Header />
      </AppLayout>
    </div>
  );
}
