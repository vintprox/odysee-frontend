// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import { LOGO_TITLE, LOGO, LOGO_TEXT_LIGHT, LOGO_TEXT_DARK } from 'config';
import Icon from 'component/common/icon';
import { useIsMobile } from 'effects/use-screensize';

type Props = {
  type: string,
  currentTheme: string,
};

export default function Logo(props: Props) {
  const { type, currentTheme } = props;
  const isMobile = useIsMobile();
  const defaultWithLabel = (
    <>
      <Icon icon={ICONS.LBRY} />
      <div className={'button__label'}>{LOGO_TITLE}</div>
    </>
  );

  if (type === 'small' || (isMobile && type !== 'embed')) {
    return LOGO ? <img className="header__odysee" src={LOGO} /> : <Icon icon={ICONS.LBRY} />;
  } else if (type === 'embed') {
    if (LOGO_TEXT_LIGHT) {
      return (
        <>
          <img src={LOGO_TEXT_LIGHT} className="header__odysee" />
        </>
      );
    } else {
      return defaultWithLabel;
    }
  } else {
    if (LOGO_TEXT_LIGHT && LOGO_TEXT_DARK) {
      return (
        <>
          <img src={currentTheme === 'light' ? LOGO_TEXT_DARK : LOGO_TEXT_LIGHT} className="header__odysee" />
        </>
      );
    } else {
      return defaultWithLabel;
    }
  }
}
