import React from 'react';
import uniqid from 'uniqid';

import { FormatTypes } from '../../../../../../../models/designer/qr.models';
import QRTabElement from '../../elements/TabElement/QRTabElement';
import styles from './qrTab.module.scss';

const QRTab = () => {
  const order = [
    FormatTypes.MeCard,
    FormatTypes.VCard,
    FormatTypes.Email,
    FormatTypes.Phone,
    FormatTypes.URL,
    FormatTypes.Text,
  ];

  return (
    <>
      <div className={styles.title}>Drag & Drop to add QR</div>
      <section className={styles.content}>
        {order.map((qr) => (
          <QRTabElement key={uniqid()} type={qr} />
        ))}
      </section>
    </>
  );
};

export default QRTab;
