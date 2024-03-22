import { useContext } from "react";

import UserContext from "./context/UserContext";

/**
 * This component renders the top banner for the web app
 * 
 * Primary actions:
 * -SignIn
 * -SignOut
 * -SignUp
 * -Courses (eg "Home" navigation link)
 * 
 * @returns Header React component
 */

const Header = () => {
    const { authUser } = useContext(UserContext);

    return (
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><a href="/">Courses</a></h1>
                <nav>
                    <ul className="header--signedout">
                    { authUser === null ?
                    <>
                        <li><a href="/signup">Sign Up</a></li>
                        <li><a href="/signin">Sign In</a></li>
                    </>
                    :
                    <>
                        <span>Welcome {authUser.firstName}</span>
                        <li><a href="/signout">Sign Out</a></li>
                    </>
                    }
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;