import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card, Input, message, notification } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { savePassword } from "../../core/actions/passwordLockActions/passwordLockActions";
import styles from "./passwordlock.module.scss";

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc,
  });
};

const PasswordLock = () => {
  // const [passwordVisible, setPasswordVisible] = useState(false);

  const [pass, setPass] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const lastPageDetails = useSelector((state) => state.lastUrl);

  const { lastUrl } = lastPageDetails;

  // console.log("last page: ", lastUrl)

  // console.log("pass: ", pass)

  const submitPassword = async () => {
    try {
      const fetchedPassword = await axios.post(`/api/fetchPassword`);
      const passDetails = fetchedPassword.data[0]?.password;
      // console.log('pass', passDetails)

      if (pass === "" || pass === null) {
        message.error("enter password");
      } else {
        const checkPass = await axios.post(`/api/checkPassword`, {
          fetchedPassword: passDetails,
          password: pass,
        });
        const checkResult = checkPass.data?.msg;
        // console.log('rety: ', checkResult)
        if (!checkResult) {
          message.error("invalid password");
        } else if (checkResult) {
          openNotificationWithIcon("success", "Success", "Access granted");
          dispatch(savePassword(pass));
          setPass("");
          router.push(lastUrl);
          // console.log(lastUrl)
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainBody}>
        <Card
          style={{
            width: "100%",
          }}
        >
          <h2>Enter password to gain access 👀</h2>
          <Input.Password
            size="large"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="input password"
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined style={{ color: "#1D133F" }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: "#1D133F" }} />
              )
            }
          />
          <button onClick={submitPassword}>Submit</button>
        </Card>
      </div>
    </div>
  );
};

export default PasswordLock;
