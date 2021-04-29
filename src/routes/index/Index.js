import React from 'react';
import { connect } from 'dva';
import styles from './style.css';
import { Button } from 'antd-mobile'
import verify from '../../utils/verify'
const wx = window.wx


class IndexPage extends React.Component {

  componentDidMount() {
    // 调用 verify方法，在当前路由页面下进行三方验证
    console.log('wx', wx)
  }




  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.test}>
          你好你好吗
        </div>
        <Button type="primary">primary</Button>
      </div>
    );
  }
}


export default connect()(IndexPage);
