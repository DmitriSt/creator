import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { FooterType } from '../../../../models/commonPage.models';
// import { getAppSocialLinks } from '../../../../services/common.service';
// import { updateSocialLinks } from '../../../stores/commonStore/commonActions';
import { RootStateType } from '../../../stores/store';
// import SocialLinks from '../SocialLinks/SocialLinks';
import styles from './footer.module.scss';

type ProductGroupPropsType = {
  footer?: FooterType;
};

const Footer = ({ footer }: ProductGroupPropsType) => {
  // const dispatch = useDispatch();
  const copyrightNotice = useSelector((state: RootStateType) => state.appState.config.copyrightNotice);
  const logo = useSelector((state: RootStateType) => state.appState.config.brandingLogo);
  // const links = useSelector((state: RootStateType) => state.commonState.socialLinks);

  // useEffect(() => {
  //   (async () => {
  //     if (!links) {
  //       const links = await getAppSocialLinks();
  //       dispatch(updateSocialLinks(links));
  //     }
  //   })();
  // }, []);

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.info_wrapper}>
          <img className={styles.logo} src={logo} alt='ePrintCreator' />
          {footer && footer.showCopyrightNotice && <span className={styles.copyright}>{copyrightNotice}</span>}
          {footer && footer.showTermsOfUser && (
            <span className={styles.links}>
              <Link to='/'>Terms Of Use</Link>
            </span>
          )}
          {
            // showPrivacyPolicy && (
            //   <span className={`${styles.links} ${styles.last_link}`}>
            //     <Link to='/'>Privacy Policy</Link>
            //   </span>
            // )
          }
        </div>
        {
          // links && !!links.length && (
          //   <div className={styles.socials_wrapper}>
          //     <span className={styles.share}>Share to</span>
          //     <SocialLinks />
          //   </div>
          // )
        }
      </div>
    </section>
  );
};

export default Footer;
