import React from "react";
import styles from "./feedback.module.scss";

const FeedbackComp = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.topPart}>
        <h1>Please provide your feedback</h1>
      </div>

      <div className={styles.formPart}>
        <form className={styles.formPartInner}>
          <div className={styles.formInput}>
            <small>
              Email <span className={styles.asterisk}>*</span>{" "}
            </small>
            <input type="text" />
          </div>
          <div className={styles.formInput}>
            <small>
              What would you like us to add or remove?
              <span className={styles.asterisk}>&#42;</span>
            </small>
            <input type="text" />
          </div>
          <div className={styles.textAreaInput}>
            <small>
              Please explain how you&#39;d like this feature to work
              <span className={styles.asterisk}>&#42;</span>
            </small>
            <textarea></textarea>
          </div>
          <div className={styles.textAreaInput}>
            <small>Anything else?</small>
            <textarea></textarea>
          </div>
          <div className={styles.buttonPart}>
            <button>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackComp;
