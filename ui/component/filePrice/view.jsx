// @flow
import * as ICONS from 'constants/icons';
import classnames from 'classnames';
import CreditAmount from 'component/common/credit-amount';
import Icon from 'component/common/icon';
import React from 'react';

type Props = {
  showFullPrice: boolean,
  costInfo?: ?{ includesData: boolean, cost: number },
  uri: string,
  fetching: boolean,
  claim: ?{},
  claimWasPurchased: boolean,
  claimIsMine: boolean,
  type?: string,
  // below props are just passed to <CreditAmount />
  showLBC?: boolean,
  isFiat?: boolean,
  hideFree?: boolean, // hide the file price if it's free
  customPrice: number,
  doFetchCostInfoForUri: (string) => void,
};

class FilePrice extends React.PureComponent<Props> {
  static defaultProps = {
    showFullPrice: false,
  };

  componentDidMount() {
    this.fetchCost(this.props);
  }

  componentDidUpdate() {
    this.fetchCost(this.props);
  }

  fetchCost = (props: Props) => {
    const { costInfo, uri, fetching, claim, doFetchCostInfoForUri } = props;

    if (uri && costInfo === undefined && !fetching && claim) {
      doFetchCostInfoForUri(uri);
    }
  };

  render() {
    const {
      costInfo,
      showFullPrice,
      showLBC,
      isFiat,
      hideFree,
      claimWasPurchased,
      type,
      claimIsMine,
      customPrice,
    } = this.props;

    if (!customPrice && (claimIsMine || !costInfo || !costInfo.cost || (!costInfo.cost && hideFree))) {
      return null;
    }

    return claimWasPurchased ? (
      <span
        className={classnames('file-price__key', {
          'file-price__key--filepage': type === 'filepage',
          'file-price__key--modal': type === 'modal',
        })}
      >
        <Icon icon={ICONS.PURCHASED} size={type === 'filepage' ? 22 : undefined} />
      </span>
    ) : (
      <CreditAmount
        className={classnames('file-price', {
          'file-price--filepage': type === 'filepage',
          'file-price--modal': type === 'modal',
        })}
        showFree
        showLBC={showLBC}
        amount={costInfo ? costInfo.cost : customPrice}
        isEstimate={!!costInfo && !costInfo.includesData}
        showFullPrice={showFullPrice}
        isFiat={isFiat}
      />
    );
  }
}

export default FilePrice;
