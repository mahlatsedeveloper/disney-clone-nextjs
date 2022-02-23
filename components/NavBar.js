import Image from "next/image"
import Link from "next/link"

import Logo from "../public/disney.png"


const NavBar = ( {account} ) => {
  return (
    <div className="navbar">
        <Link href="/">
            <Image src={Logo} alt="Disney" width={200} height={50} priority />
        </Link>
        <div className="navbar-right">
            <p>Welcome {account.username}</p>
            <Image src={account.avatar.url} className="avatar" alt="Avatar" width={50} height={50} priority />
        </div>
    </div>
  )
}

export default NavBar