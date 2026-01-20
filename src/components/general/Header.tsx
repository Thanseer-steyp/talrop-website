import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-row wrapper items-center justify-between py-4">
      <div className="w-[60px]">
        <Image
          src="https://s3.ap-south-1.amazonaws.com/talrop.com-react-assets-bucket/assets/images/01-09-2022/Talrop_logo.svg"
          width={100}
          height={100}
          alt="Logo"
        />
      </div>
      <ul className="flex flex-row justify-between w-[50%]">
        <li>
          <Link href="#" className="active-nav">
            Home
          </Link>
        </li>
        <li>
          <Link href="#">About</Link>
        </li>
        <li>
          <Link href="#">Ecosystem</Link>
        </li>
        <li>
          <Link href="#">Projects</Link>
        </li>
        <li>
          <Link href="#">Missions</Link>
        </li>
        <li>
          <Link href="#">Contact</Link>
        </li>
      </ul>
    </div>
  );
}
