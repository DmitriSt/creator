import { CancelToken } from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { getCancelController } from '../../../../httpClient';
import { ParamsType } from '../../../../models/commonPage.models';
import { CardSide, PagingModel, SearchResponseItem, ThemeCardType, ThemeTDO } from '../../../../models/themes.models';
import { getThemesCards } from '../../../../services/themesPage.service';
import { RootStateType } from '../../../stores/store';
import { updateSearchResults } from '../../../stores/themesStore/search/searchActions';
import { initThemesCards, updateThemesCards } from '../../../stores/themesStore/themes/themesActions';
import Loader from '../../sharedComponents/Loader/Loader';
import ThemePopup from './ThemePopup/ThemePopup';
import styles from './themes.module.scss';
import ThemesList from './ThemesList/ThemesList';

const Themes = () => {
  const dispatch = useDispatch();
  const search = useSelector((state: RootStateType) => state.themesState.search.search);
  const themes = useSelector((state: RootStateType) => state.themesState.themes.themes);

  // const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isAdditionalItems, setIsAdditionalItems] = useState(false);
  const [isMoreItems, setIsMoreItems] = useState(true);

  const { id } = useParams<ParamsType>();

  const convertData = (pageData: SearchResponseItem[]) => {
    return pageData.map((item) => {
      const card: ThemeCardType = {
        cardId: item.cardId,
        cardType: item.cardType,
        description: item.image.description,
        name: item.image.name,
        previews: [
          {
            title: CardSide.Back,
            description: 'sadawww',
            url: item.image.url,
          },
          {
            title: CardSide.Front,
            description: 'sadawww',
            url: item.image.url,
          },
        ],
        supportedDesigners: '',
      };
      return card;
    });
  };

  // const updateLoading = (val: boolean) => setIsLoading(val);

  const updatePage = (val: number) => setPage(val);

  const getThemes = async (
    pageNum: number,
    size: number,
    controller?: CancelToken
  ): Promise<PagingModel<ThemeCardType>> => {
    // await new Promise((res) => {
    //   setTimeout(() => res('asd'), 2000000);
    // });
    const attributes = search ? Object.values(search) : [];
    const dto: ThemeTDO = {
      productId: +id,
      page: pageNum,
      pageSize: size,
      attributes,
    };
    const data = await getThemesCards(dto, controller);
    return {
      ...data,
      pageData: data.pageData && data.pageData.length ? convertData(data.pageData) : [],
    };
  };

  const getInitialThemes = async (controller: CancelToken) => {
    updatePage(0);
    const { pageData, matchCount } = await getThemes(0, 20, controller);
    if (typeof matchCount === 'number') {
      if (pageData && pageData.length && pageData.length >= matchCount && matchCount > 0) {
        setIsMoreItems(false);
      }
      dispatch(updateSearchResults(matchCount));
    }
    dispatch(initThemesCards(pageData));
    setIsAdditionalItems(false);
    // updateLoading(false);
  };

  const getAdditionalThemes = async () => {
    if (!themes) {
      setIsAdditionalItems(false);
      return;
    }
    updatePage(page + 1);
    // await new Promise((res) => {
    //   setTimeout(() => res('asd'), 500000);
    // });
    const { pageData } = await getThemes(page + 1, 10);
    if (!pageData.length) {
      setIsMoreItems(false);
      setIsAdditionalItems(false);
      return;
    }
    dispatch(updateThemesCards(pageData));
    // updateLoading(false);
    setIsAdditionalItems(false);
  };

  useEffect(() => {
    const controller = getCancelController();
    if (search) {
      setIsMoreItems(true);
      // updateLoading(true);
      getInitialThemes(controller.token);
    }
    return () => controller.cancel();
  }, [search]);

  useEffect(() => {
    const elem = document.getElementById('ThemesIntersectionObserverTarget');
    const observer: IntersectionObserver = null;
    if (elem) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsAdditionalItems(true);
            }
          });
        },
        { threshold: [0], rootMargin: '0px 0px 100px 0px' }
      );
      observer.observe(elem);
    }
    return () => {
      if (observer && elem) {
        observer.unobserve(elem);
      }
    };
  }, []);

  useEffect(() => {
    if (isAdditionalItems && isMoreItems) {
      // updateLoading(true);
      getAdditionalThemes();
    }
  }, [isAdditionalItems]);

  return (
    <div className={styles.themes}>
      <div className={styles.wrapper}>
        {
          // isLoading && (
          //   <div className={styles.loader}>
          //     <Loader isLocal />
          //   </div>
          // )
        }
        <ThemePopup />
        <ThemesList />
        {isAdditionalItems && (
          <div className={styles.bottomLoaderWrap}>
            <Loader isLocal />
          </div>
        )}
        {isMoreItems && <div id='ThemesIntersectionObserverTarget' />}
      </div>
    </div>
  );
};

export default Themes;
