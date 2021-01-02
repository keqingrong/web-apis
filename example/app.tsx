import * as React from 'react';
import { NavBar, List } from 'antd-mobile';
import { apis } from './apis';
import 'antd-mobile/dist/antd-mobile.css';

interface AppProps {}

function App({}: AppProps) {
  return (
    <div>
      <NavBar mode="light">示例</NavBar>
      <List>
        {apis.map(item => (
          <List.Item
            key={item[0]}
            arrow="horizontal"
            onClick={() => item[1](item[0])}
          >
            {item[0]}
          </List.Item>
        ))}
      </List>
    </div>
  );
}

export default App;
