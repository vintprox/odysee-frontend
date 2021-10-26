import { connect } from 'react-redux';
import {
  makeSelectTitleForUri,
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  selectFetchingMyChannels,
} from 'redux/selectors/claims';
import { doHideModal } from 'redux/actions/app';
import { doSendTip, doSendCashTip } from 'redux/actions/wallet';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectBalance, selectIsSendingSupport } from 'redux/selectors/wallet';
import { withRouter } from 'react-router';
import * as SETTINGS from 'constants/settings';
import WalletSendTip from './view';

const select = (state, props) => ({
  isPending: selectIsSendingSupport(state),
  title: makeSelectTitleForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri, false)(state),
  balance: selectBalance(state),
  instantTipEnabled: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state),
  instantTipMax: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  fetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  incognito: selectIncognito(state),
});

export default withRouter(connect(select, { doHideModal, doSendTip, doSendCashTip })(WalletSendTip));
