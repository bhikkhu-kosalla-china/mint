import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { Alert } from "antd";

import { useAppSelector } from "../../hooks";
import { currentUser as _currentUser } from "../../reducers/current-user";

const LoginAlertWidget = () => {
  const intl = useIntl();

  const user = useAppSelector(_currentUser);
  return user ? (
    <></>
  ) : (
    <Alert
      message={intl.formatMessage({
        id: "message.auth.guest.alert",
      })}
      type="warning"
      closable
      action={
        <Link to="/anonymous/users/sign-in">
          {intl.formatMessage({
            id: "buttons.sign-in",
          })}
        </Link>
      }
    />
  );
};

export default LoginAlertWidget;
