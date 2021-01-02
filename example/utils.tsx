import * as React from 'react';
import { Modal } from 'antd-mobile';

const alertModal = (title: React.ReactNode, message: React.ReactNode) => {
  Modal.alert(title, <div style={{ wordBreak: 'break-all' }}>{message}</div>);
};

export async function openModal(fnName: string, fnReturnValue: any) {
  if (
    fnReturnValue !== null &&
    typeof fnReturnValue === 'object' &&
    typeof fnReturnValue.then === 'function'
  ) {
    fnReturnValue.then(
      (res: any) => {
        console.log(fnName, res);
        alertModal(fnName, JSON.stringify(res, null, 2));
      },
      (err: Error) => {
        console.log(fnName, err);
        alertModal(fnName, err.message);
      }
    );
  } else if (fnReturnValue instanceof Error) {
    console.log(fnName, fnReturnValue);
    alertModal(fnName, fnReturnValue.message);
  } else {
    console.log(fnName, fnReturnValue);
    alertModal(fnName, JSON.stringify(fnReturnValue, null, 2));
  }
}
