import React,{useState,useEffect,useRef} from "react";
import NotificationModal from "./NotificationModal/NotificationModal";

const Navbar = () => {
    const [notificationsModal, setnotificationsModal] = useState(false);
    const toggleNotificationsModal = () => {
      setnotificationsModal((current) => !current)
    }
    const modalRef = useRef();
    useEffect(() => {
      function handleClickOutside(event) {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setnotificationsModal(false); // Step 3: Close the modal if click is outside
        }
      }
  
      window.addEventListener('click', handleClickOutside);
      return () => {
        window.removeEventListener('click', handleClickOutside); // Clean up the event listener
      };
    }, []);

  return (
    <header className="main-header">
    <nav className="main-header__nav">
        <ul className="main-header__item-list">
            <a href="/"><img className="logo-icon" src="/icons/plogo.png"></img></a>
            <li className="main-header__item">
                <a class="<%= path === '/' ? 'active' : '' %>" href="/">Home</a>
            </li>
            
            <li class="main-header__item">
                <a class="<%= path === '/aboutUs' ? 'active' : '' %>" href="/aboutUs">About us</a>
            </li>
        </ul>
        <section>
            <img className="navbar-icon" onClick={toggleNotificationsModal} src="/icons/notification-bell.png"></img>
            <img  className="navbar-icon" src="/icons/user.png"></img>
        </section>
        {notificationsModal && <div>
          <NotificationModal message="Up to date with Notifications"/>
          </div>}
    </nav>
</header>
  );
};

export default Navbar;