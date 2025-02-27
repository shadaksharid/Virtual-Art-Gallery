import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationAsRead } from "../redux/notificationSlice";

const Notifications = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
    };

    return (
        <div>
            <h3>Notifications</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {list.map((notif) => (
                    <li key={notif._id} style={{ background: notif.isRead ? "#ddd" : "#fff" }}>
                        {notif.message}
                        {!notif.isRead && (
                            <button onClick={() => handleMarkAsRead(notif._id)}>Mark as Read</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
