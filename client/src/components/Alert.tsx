import { useAlert } from "src/hooks";
import UIAlert from "@adamjanicki/ui/components/Alert";
import "src/components/alert.css";

const Alert = () => {
  const { alert } = useAlert();
  return (
    <div style={{ opacity: Number(Boolean(alert)) }} className="toast">
      {alert ? <UIAlert type={alert.type}>{alert.message}</UIAlert> : null}
    </div>
  );
};

export default Alert;
