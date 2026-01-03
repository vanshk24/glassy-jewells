import { Info } from "lucide-react";
import styles from "./razorpay-test-notice.module.css";

export function RazorpayTestNotice() {
  return (
    <div className={styles.notice}>
      <Info className={styles.icon} />
      <div className={styles.content}>
        <strong>Test Mode Active</strong>
        <p>
          This is using Razorpay test mode. Use test card: <code>4111 1111 1111 1111</code> or test UPI: <code>success@razorpay</code>
        </p>
      </div>
    </div>
  );
}
