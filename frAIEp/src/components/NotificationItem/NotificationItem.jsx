
const NotificationItem = ({ notification }) => {
  return (
    <div className="notification-item">
      {notification ? (
        <p className="notification-message">{notification}</p>
      ) : (
        <p className="notification-message">Aún no tiene notificaciones</p>
      )}
      <div className="info-icon-container">
        <img src={process.env.PUBLIC_URL + "/icons/infoNotf.png"} className="info-icon"></img>
      </div>
    </div>
  );
};

export default NotificationItem;
