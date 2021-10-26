// @flow
import { EMOTES_24px as EMOTES } from 'constants/emotes';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import emoji from 'emoji-dictionary';
import OptimizedImage from 'component/optimizedImage';
import React from 'react';

const OLD_QUICK_EMOJIS = [
  emoji.getUnicode('rocket'),
  emoji.getUnicode('jeans'),
  emoji.getUnicode('fire'),
  emoji.getUnicode('heart'),
  emoji.getUnicode('open_mouth'),
];

type Props = { commentValue: string, setCommentValue: (string) => void, closeSelector: () => void };

export default function EmoteSelector(props: Props) {
  const { commentValue, setCommentValue, closeSelector } = props;

  function addEmoteToComment(emote: string) {
    setCommentValue(
      commentValue + (commentValue && commentValue.charAt(commentValue.length - 1) !== ' ' ? ` ${emote} ` : `${emote} `)
    );
  }

  return (
    <div className="emote__selector">
      <Button button="close" icon={ICONS.REMOVE} onClick={closeSelector} />

      <div className="emotes-list">
        <div className="emotes-list--row">
          <div className="emotes-list--row-title">{__('Global Emotes')}</div>
          <div className="emotes-list--row-items">
            {OLD_QUICK_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                label={emoji}
                button="alt"
                className="button--file-action"
                onClick={() => addEmoteToComment(emoji)}
              />
            ))}
            {Object.keys(EMOTES).map((emote) => (
              <Button
                key={String(emote)}
                title={`:${emote.toLowerCase()}:`}
                button="alt"
                className="button--file-action"
                onClick={() => addEmoteToComment(`:${emote.toLowerCase()}:`)}
              >
                <OptimizedImage src={String(EMOTES[emote])} waitLoad />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
