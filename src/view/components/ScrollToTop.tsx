import { History } from 'history';
import React, { ReactNode, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

type ScrollToTopPropsType = {
  history: History;
  children?: ReactNode;
};

function ScrollToTop({ history, children }: ScrollToTopPropsType) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, []);
  return <>{children}</>;
}
export default withRouter(ScrollToTop);
