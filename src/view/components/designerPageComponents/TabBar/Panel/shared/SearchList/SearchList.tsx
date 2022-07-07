import React from 'react';
import uniqid from 'uniqid';

import styles from '../../../tabBar.module.scss';
import TabLists from '../TabLists/TabLists';

const SearchList = ({ lists, type, columns }: any) => {
  const myImgScroll = document.getElementById('catalogSearch');
  let startHeight = 0;

  if (myImgScroll) {
    startHeight = myImgScroll.getBoundingClientRect().top;
  }
  return (
    <div
      id='catalogSearch'
      className={styles.defaultScroll}
      style={{
        height: `${window.innerHeight - startHeight}px`,
      }}
    >
      {lists.map((list: any, i: number) => (
        <TabLists key={uniqid()} lists={list} index={i} type={type} columns={columns} />
      ))}
    </div>
  );
};

export default SearchList;
