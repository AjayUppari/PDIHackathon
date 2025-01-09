import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Navbar({ userType, username }) {
  const location = useLocation();
  const nav = useNavigate();

  const userRole = localStorage.getItem('userRole');

  return (
    <nav className="bg-[#07003D] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to={`/${userRole!='null' ? userRole.toLowerCase() : 'participant'}`}>
              <img
                src="https://pditechnologies.com/wp-content/uploads/2022/06/PDI_Logo_White.svg"
                alt="HackathonHub Logo"
                className="h-12 w-auto"
              />
            </Link>


            <Link
              to={`/${userRole!='null' ? userRole.toLowerCase() : 'participant'}`}
              className="text-xl text-white font-medium hover:text-[#00D2F4] transition-colors"
            >
              Home
            </Link>
            {userType == "Reviewer" &&
              <Link
                to={`/${userRole.toLowerCase()}`}
                className="text-xl text-white font-medium hover:text-[#00D2F4] transition-colors"
              >
                My Reviews
              </Link>}


            {userType === 'organizer' && (
              <>
                <Link
                  to="/organizer"
                  className={`text-lg ${location.pathname.includes('/events') ? 'text-[#00D2F4]' : 'text-white hover:text-[#00D2F4]'}`}
                >
                  My Events
                </Link>
                <Link
                  to="/organizer/drafts"
                  className={`text-lg ${location.pathname.includes('/drafts') ? 'text-[#00D2F4]' : 'text-white hover:text-[#00D2F4]'}`}
                >
                  My Drafts
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {username}</span>
            <button
              onClick={() => {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userData');
                nav('/');
              }}
              className="bg-[#00D2F4] px-4 py-2 rounded-md text-sm hover:bg-[#1226AA] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
