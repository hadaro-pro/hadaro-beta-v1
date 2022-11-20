import React,  { useState } from 'react'
import { Modal, message, Select } from "antd";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from './lendoutro.module.scss'

const LendOutroModal = ({ outroOpen, cancleOutro, finalLendObject }) => {


  const processLend = () => {
    message.success(`lending successful!`, [5])
    cancleOutro()
  }

  return (
    <Modal
    open={outroOpen}
    footer={null}
    onCancel={cancleOutro}
    className={styles.modalContainer}
    >
      <h3>Are you sure?</h3>
      <div className={styles.modalButtons} >
        <button onClick={() => processLend()} >Yes</button>
        <button onClick={() => cancleOutro()} >No</button>
      </div>
    </Modal>
  )
}

export default LendOutroModal