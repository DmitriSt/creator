import React from 'react';
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';

import { MenuItemType } from '../../../../models/commonPage.models';
// import { productGroupView } from '../../stores/productGroupPageStore/ProductGroupPageReducers;
import styles from './menu.module.scss';
import MenuItem from './MenuItem/MenuItem';
import MenuList from './MenuList/MenuList';

type MenuPropsType = {
  items: MenuItemType[];
};

const Menu = ({ items }: MenuPropsType) => {
  const menuElements = items.map((element) => {
    const getInnerContent = (el: MenuItemType) => {
      const innerTree = (
        <MenuItem key={el.text} data={el.text} className='menu_item1'>
          {el.subMenus !== undefined && el.subMenus !== null && !!el.subMenus.length && (
            <MenuList className='menu_list2'>
              {el.subMenus.map((item) => (
                <Link key={uniqid()} to={`/${item.action}`}>
                  <MenuItem data={item.text} className='menu_item2' />
                </Link>
              ))}
            </MenuList>
          )}
        </MenuItem>
      );
      return el.action ? (
        <Link key={uniqid()} to={`/${el.action}`}>
          {innerTree}
        </Link>
      ) : (
        innerTree
      );
    };
    const content = (
      <MenuItem data={element.text} className='navigation_element'>
        {element.subMenus !== undefined && element.subMenus !== null && (
          <MenuList className='menu_list1'>{element.subMenus.map((el) => getInnerContent(el))}</MenuList>
        )}
      </MenuItem>
    );
    return element.action ? (
      <Link key={uniqid()} to={`/${element.action}`} className={styles.content_wrapper}>
        {content}
      </Link>
    ) : (
      <div key={uniqid()} className={styles.content_wrapper}>
        {content}
      </div>
    );
  });

  return (
    <nav className={styles.wrapper}>
      <ul className={styles.navigation_elements}>{menuElements}</ul>
    </nav>
  );
};

export default Menu;
