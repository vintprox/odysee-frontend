// @flow
import React from 'react';
import { FREE_GLOBAL_STICKERS, PAID_GLOBAL_STICKERS } from 'constants/stickers';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import OptimizedImage from 'component/optimizedImage';
import CreditAmount from 'component/common/credit-amount';

const buildStickerSideLink = (section: string, icon: string) => ({ section, icon });

const STICKER_SIDE_LINKS = [
  buildStickerSideLink(__('Free'), ICONS.TAG),
  buildStickerSideLink(__('Tips'), ICONS.FINANCE),
  // Future work may include Channel, Subscriptions, ...
];

type Props = { claimIsMine: boolean, onSelect: (any) => void };

export default function StickerSelector(props: Props) {
  const { claimIsMine, onSelect } = props;

  function scrollToStickerSection(section: string) {
    const listItemsEl = document.querySelector('.stickers-list__items');
    const sectionToScroll = document.getElementById(section);
    if (listItemsEl && sectionToScroll) {
      // $FlowFixMe
      listItemsEl.scrollTo({
        top: sectionToScroll.offsetTop - sectionToScroll.getBoundingClientRect().height * 2,
        behavior: 'smooth',
      });
    }
  }

  const getListRow = (rowTitle: string, rowStickers: any) => (
    <div className="stickers-list__items--row">
      <div id={rowTitle} className="stickers-list__items--row-title">
        {rowTitle}
      </div>
      <div className="stickers-list__items--row-items">
        {rowStickers.map((sticker) => (
          <Button
            key={sticker.name}
            title={sticker.name}
            button="alt"
            className="button--file-action"
            onClick={() => onSelect(sticker)}
          >
            <OptimizedImage src={sticker.url} />
            {sticker.price && sticker.price > 0 && (
              <CreditAmount superChatLight amount={sticker.price} size={2} isFiat />
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="sticker__selector">
      <div className="card__header--between sticker__selector--header">
        <div className="sticker__selector--title">{__('Stickers')}</div>
      </div>

      <div className="stickers-list">
        <div className="stickers-list__items">
          {getListRow(__('Free'), FREE_GLOBAL_STICKERS)}
          {!claimIsMine && getListRow(__('Tips'), PAID_GLOBAL_STICKERS)}
        </div>

        <div className="navigation__wrapper">
          <ul className="navigation-links">
            {STICKER_SIDE_LINKS.map(
              (linkProps) =>
                ((claimIsMine && linkProps.section !== 'Tips') || !claimIsMine) && (
                  <li key={linkProps.section}>
                    <Button
                      label={__(linkProps.section)}
                      title={__(linkProps.section)}
                      icon={linkProps.icon}
                      iconSize={1}
                      className="navigation-link"
                      onClick={() => scrollToStickerSection(linkProps.section)}
                    />
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
