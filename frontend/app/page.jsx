import Image from "next/image";
import ButtonComponent from "./component/ButtonComponent";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      this is the main page of the application in this directory. Create folder in this directory and add page.jsx to start routing in the name of that folder name. Add components too Here below is the example of using components. Use "use client" at top when using hooks in the page. --- Written by Anish Jaiswal
      <div>
        <ButtonComponent />
        </div> 
    </div>
  );
}
