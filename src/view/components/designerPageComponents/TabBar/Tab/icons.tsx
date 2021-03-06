import React from 'react';

import { TabIconsType, TabSettings, TabTools } from '../../../../../models/designer/tabBar.models';

const icons: TabIconsType = {
  [TabTools.Templates]: (
    <svg width='34' height='21' viewBox='0 0 34 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M26 8H2V19H26V8ZM2 6C0.895431 6 0 6.89543 0 8V19C0 20.1046 0.895431 21 2 21H26C27.1046 21 28 20.1046 28 19V8C28 6.89543 27.1046 6 26 6H2Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6 3C6 1.34315 7.34315 0 9 0H31C32.6569 0 34 1.34315 34 3V14C34 15.6569 32.6569 17 31 17H29V15H31C31.5523 15 32 14.5523 32 14V3C32 2.44772 31.5523 2 31 2H9C8.44772 2 8 2.44772 8 3V5H6V3Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6 8H2V19H6V8ZM2 6C0.895431 6 0 6.89543 0 8V19C0 20.1046 0.895431 21 2 21H8V6H2Z'
        fill='white'
      />
    </svg>
  ),
  [TabTools.Layouts]: (
    <svg width='28' height='23' viewBox='0 0 28 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19 2H26V21H19V2ZM17 2H11V21H17V2ZM9 21V2H2V21H9ZM9 0H19H26C27.1046 0 28 0.895431 28 2V21C28 22.1046 27.1046 23 26 23H19H9H2C0.895431 23 0 22.1046 0 21V2C0 0.89543 0.895431 0 2 0H9Z'
        fill='white'
      />
    </svg>
  ),
  [TabTools.Images]: (
    <svg width='28' height='23' viewBox='0 0 28 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M24 7C24 8.65685 22.6569 10 21 10C19.3431 10 18 8.65685 18 7C18 5.34315 19.3431 4 21 4C22.6569 4 24 5.34315 24 7ZM22 7C22 7.55228 21.5523 8 21 8C20.4477 8 20 7.55228 20 7C20 6.44772 20.4477 6 21 6C21.5523 6 22 6.44772 22 7Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2 0C0.895431 0 0 0.89543 0 2V21C0 22.1046 0.895431 23 2 23H26C27.1046 23 28 22.1046 28 21V2C28 0.895431 27.1046 0 26 0H2ZM26 2H2V18.7636L6.75761 9.24841C7.47687 7.80988 9.5137 7.76562 10.2948 9.17155L13.8172 15.5119L16.271 13.6716C17.0091 13.118 18.0302 13.1412 18.7424 13.7277L26 19.7045V2ZM24.427 21H3.11788L8.54646 10.1428L12.0689 16.4832C12.6578 17.5433 14.0471 17.8395 15.0172 17.1119L17.471 15.2716L24.427 21Z'
        fill='white'
      />
    </svg>
  ),
  [TabTools.Backgrounds]: (
    <svg width='28' height='21' viewBox='0 0 28 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2 0C0.895431 0 0 0.89543 0 2V19C0 20.1046 0.895431 21 2 21H26C27.1046 21 28 20.1046 28 19V2C28 0.895431 27.1046 0 26 0H2ZM11.5859 2H8.41436L2 8.41436V11.5859L11.5859 2ZM14.4144 2L2 14.4144V17.5859L17.5859 2H14.4144ZM6.58594 19H3.41437L20.4144 2H23.5859L6.58594 19ZM9.41437 19H12.5859L26 5.58594V2.41437L9.41437 19ZM18.5859 19H15.4144L26 8.41436V11.5859L18.5859 19ZM21.4144 19H26V14.4144L21.4144 19ZM2 2H5.58594L2 5.58594V2Z'
        fill='white'
      />
    </svg>
  ),
  [TabTools.Clipart]: (
    <svg width='40' height='14' viewBox='0 0 40 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19.5737 2.33238C17.6737 0.211021 15.5692 -0.209751 13.7664 0.0829765C12.045 0.362478 10.668 1.28022 10.0793 1.6746C9.8855 1.8044 9.65099 1.98423 9.37934 2.19255C8.62954 2.76753 7.59678 3.55949 6.35731 4.1151C5.54573 4.4789 4.76171 4.67657 4.05751 4.62708C3.39136 4.58027 2.73246 4.30994 2.1156 3.59868C1.7526 3.18015 1.20135 3.08999 0.76417 3.2556C0.296714 3.43267 -0.0956076 3.93697 0.0206227 4.57326C0.53932 7.41284 3.03389 12.5894 8.89226 13.7668C13.1515 14.6228 16.8196 13.02 18.9457 10.6097C19.3122 10.1942 19.6379 9.74578 19.9137 9.27546C20.1896 9.74578 20.5153 10.1942 20.8818 10.6097C23.0079 13.02 26.676 14.6228 30.9352 13.7668C36.7936 12.5894 39.2882 7.41284 39.8069 4.57326C39.9231 3.93697 39.5308 3.43267 39.0633 3.2556C38.6262 3.08999 38.0749 3.18015 37.7119 3.59868C37.095 4.30994 36.4361 4.58027 35.77 4.62708C35.0658 4.67657 34.2818 4.4789 33.4702 4.1151C32.2307 3.55949 31.198 2.76755 30.4482 2.19257C30.1765 1.98427 29.942 1.8044 29.7482 1.6746C29.1595 1.28022 27.7825 0.362478 26.0611 0.0829765C24.2583 -0.209751 22.1538 0.211021 20.2538 2.33238C20.1315 2.46892 20.0182 2.60834 19.9138 2.7503C19.8093 2.60834 19.696 2.46892 19.5737 2.33238ZM20.9166 5.86706C20.9166 5.8586 20.9167 5.85013 20.9167 5.84167C20.9236 5.02763 21.1994 4.27435 21.7436 3.66675C23.1607 2.08457 24.5683 1.86678 25.7406 2.05712C26.9943 2.26069 28.0551 2.94764 28.6351 3.33621C28.7131 3.38847 28.8468 3.49149 29.0261 3.62957C29.7341 4.17511 31.1523 5.26781 32.6521 5.94013C33.6246 6.37608 34.7528 6.7035 35.9102 6.62216C36.3276 6.59283 36.7397 6.51079 37.1404 6.36907C36.1234 8.59514 34.0529 11.1002 30.5412 11.806C27.0088 12.5159 24.054 11.1825 22.3817 9.28667C21.4028 8.17691 20.9148 6.96744 20.9166 5.86706ZM18.9108 5.84157C18.9039 5.02756 18.6281 4.27432 18.0839 3.66675C16.6668 2.08457 15.2592 1.86678 14.0869 2.05712C12.8332 2.26069 11.7724 2.94764 11.1924 3.33621C11.1143 3.38849 10.9806 3.49156 10.8013 3.62971C10.0932 4.17524 8.67525 5.26781 7.1754 5.94013C6.20287 6.37608 5.07472 6.7035 3.9173 6.62216C3.49992 6.59283 3.08782 6.51079 2.68712 6.36907C3.70413 8.59514 5.77462 11.1002 9.28632 11.806C12.8187 12.5159 15.7735 11.1825 17.4458 9.28667C18.4247 8.17695 18.9127 6.96752 18.9109 5.86717C18.9109 5.85863 18.9108 5.8501 18.9108 5.84157Z'
        fill='white'
      />
    </svg>
  ),
  [TabTools.Text]: (
    <svg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillOpacity='0'
        d='M8.68491 19.2425H17.3345L18.9367 23.6793C19.2229 24.4719 19.9752 25 20.8178 25H22.5008C23.9275 25 24.8954 23.5489 24.3473 22.2316L16.0249 2.23163C15.7146 1.48588 14.9862 1 14.1784 1H12.0409C11.2395 1 10.5155 1.47839 10.2012 2.21558L1.67373 22.2156C1.1112 23.5349 2.07924 25 3.51348 25H5.11436C5.94439 25 6.68816 24.4873 6.98348 23.7116L8.68491 19.2425ZM13.1162 7.6528H13.1291L15.7075 14.7601H10.3993L13.1162 7.6528Z'
        stroke='white'
        strokeWidth='2'
      />
    </svg>
  ),
  [TabTools.QR]: (
    <svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        strokeWidth='0'
        d='M0 3C0 1.34315 1.34315 0 3 0H9C9.55229 0 10 0.447715 10 1C10 1.55228 9.55229 2 9 2H3C2.44772 2 2 2.44772 2 3V9C2 9.55229 1.55228 10 1 10C0.447715 10 0 9.55229 0 9V3Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M0 25C0 26.6569 1.34315 28 3 28H9C9.55229 28 10 27.5523 10 27C10 26.4477 9.55229 26 9 26H3C2.44772 26 2 25.5523 2 25V19C2 18.4477 1.55228 18 1 18C0.447715 18 0 18.4477 0 19V25Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M25 0C26.6569 0 28 1.34315 28 3V9C28 9.55229 27.5523 10 27 10C26.4477 10 26 9.55229 26 9V3C26 2.44772 25.5523 2 25 2H19C18.4477 2 18 1.55228 18 1C18 0.447715 18.4477 0 19 0H25Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M28 25C28 26.6569 26.6569 28 25 28H19C18.4477 28 18 27.5523 18 27C18 26.4477 18.4477 26 19 26H25C25.5523 26 26 25.5523 26 25V19C26 18.4477 26.4477 18 27 18C27.5523 18 28 18.4477 28 19V25Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5 7C5 5.89543 5.89543 5 7 5H11C12.1046 5 13 5.89543 13 7V11C13 12.1046 12.1046 13 11 13H7C5.89543 13 5 12.1046 5 11V7ZM7 11V7H11V11H7Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M18 19C18 18.4477 18.4477 18 19 18C19.5523 18 20 18.4477 20 19C20 19.5523 19.5523 20 19 20C18.4477 20 18 19.5523 18 19Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M17 16C16.4477 16 16 16.4477 16 17C16 17.5523 16.4477 18 17 18C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M16 21C16 20.4477 16.4477 20 17 20C17.5523 20 18 20.4477 18 21C18 21.5523 17.5523 22 17 22C16.4477 22 16 21.5523 16 21Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M21 16C20.4477 16 20 16.4477 20 17C20 17.5523 20.4477 18 21 18C21.5523 18 22 17.5523 22 17C22 16.4477 21.5523 16 21 16Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M20 21C20 20.4477 20.4477 20 21 20C21.5523 20 22 20.4477 22 21C22 21.5523 21.5523 22 21 22C20.4477 22 20 21.5523 20 21Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 15C5.89543 15 5 15.8954 5 17V21C5 22.1046 5.89543 23 7 23H11C12.1046 23 13 22.1046 13 21V17C13 15.8954 12.1046 15 11 15H7ZM11 17H7V21H11V17Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        d='M19 8C18.4477 8 18 8.44772 18 9C18 9.55228 18.4477 10 19 10C19.5523 10 20 9.55228 20 9C20 8.44772 19.5523 8 19 8Z'
        fill='white'
      />
      <path
        strokeWidth='0'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15 7C15 5.89543 15.8954 5 17 5H21C22.1046 5 23 5.89543 23 7V11C23 12.1046 22.1046 13 21 13H17C15.8954 13 15 12.1046 15 11V7ZM17 7H21V11H17V7Z'
        fill='white'
      />
    </svg>
  ),
  [TabTools.Favourites]: (
    <svg width='31' height='27' viewBox='0 0 31 27' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillOpacity='0'
        d='M15.5 25.4021C12.5277 21.8017 9.57982 19.3738 7.15547 17.3771C6.56849 16.8936 6.01219 16.4355 5.49367 15.9921C2.63315 13.5459 1 11.6239 1 8.34234C1 5.05582 3.18891 2.34595 5.99972 1.37794C8.73463 0.436082 12.1419 1.12868 14.6685 4.91017L15.5 6.15462L16.3315 4.91017C18.8581 1.12868 22.2654 0.436082 25.0003 1.37794C27.8111 2.34595 30 5.05582 30 8.34234C30 11.6239 28.3668 13.5459 25.5063 15.9921C24.9878 16.4355 24.4315 16.8936 23.8445 17.3771C21.4202 19.3738 18.4723 21.8017 15.5 25.4021Z'
        stroke='white'
        strokeWidth='2'
      />
    </svg>
  ),
  [TabSettings.ProductSettings]: (
    <svg width='34' height='27' viewBox='0 0 34 27' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M5 14L5 26' stroke='white' strokeWidth='2' strokeLinecap='round' />
      <path d='M5 1L5 5' stroke='white' strokeWidth='2' strokeLinecap='round' />
      <path d='M17 1L17 14' stroke='white' strokeWidth='2' strokeLinecap='round' />
      <path d='M29 1V5' stroke='white' strokeWidth='2' strokeLinecap='round' />
      <path d='M29 13V26' stroke='white' strokeWidth='2' strokeLinecap='round' />
      <path d='M17 23L17 26' stroke='white' strokeWidth='2' strokeLinecap='round' />
      <rect x='1' y='5' width='8' height='8' rx='2' stroke='white' strokeWidth='2' strokeLinecap='round' />
      <rect x='25' y='5' width='8' height='8' rx='2' stroke='white' strokeWidth='2' strokeLinecap='round' />
      <rect x='13' y='14' width='8' height='8' rx='2' stroke='white' strokeWidth='2' strokeLinecap='round' />
    </svg>
  ),
};

export default icons;
