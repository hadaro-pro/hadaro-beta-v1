import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import styles from "./feedback.module.scss";
import { message, notification } from "antd";

const FeedbackComp = () => {
  const form = useRef();

  const openNotificationWithIcon = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
    });
  };

  const checkEmail = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;

  const sendEmail = (e) => {
    e.preventDefault();

    const userEmail = e.target.user_email?.value;
    const mainMessage = e.target.add_or_remove_message?.value;
    const howItWorks = e.target.how_feature_works_message?.value;
    const otherMessage = e.target.other_message?.value;
    // const msgObj = { userEmail, mainMessage, howItWorks, otherMessage };

    if (userEmail === "" || mainMessage === "" || howItWorks === "") {
      message.error("please fill the important fields...");
    } else if (!checkEmail.test(userEmail)) {
      message.error("Invalid email entered!");
    } else {
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          form.current,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        )
        .then(
          (result) => {
            // console.log(result.text);
            e.target.reset();
            openNotificationWithIcon(
              "success",
              "Submission success",
              "Successfully submitted feedback"
            );
          },
          (error) => {
            // console.log(error);
            openNotificationWithIcon(
              "error",
              "Something went wrong",
              "Unable to submit feedback"
            );
          }
        );
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topPart}>
        <h1>Please provide your feedback</h1>
      </div>

      <div className={styles.formPart}>
        <form className={styles.formPartInner} ref={form} onSubmit={sendEmail}>
          <div className={styles.formInput}>
            <small>
              Email <span className={styles.asterisk}>*</span>{" "}
            </small>
            <input type="text" name="user_email" />
          </div>
          <div className={styles.formInput}>
            <small>
              What would you like us to add or remove?
              <span className={styles.asterisk}>&#42;</span>
            </small>
            <input type="text" name="add_or_remove_message" />
          </div>
          <div className={styles.textAreaInput}>
            <small>
              Please explain how you&#39;d like this feature to work
              <span className={styles.asterisk}>&#42;</span>
            </small>
            <textarea name="how_feature_works_message"></textarea>
          </div>
          <div className={styles.textAreaInput}>
            <small>Anything else?</small>
            <textarea name="other_message"></textarea>
          </div>
          <div className={styles.buttonPart}>
            {/* <button>Submit</button> */}
            <input type="submit" value="Submit" className={styles.buttonItem} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackComp;
