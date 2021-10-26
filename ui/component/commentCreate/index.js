import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  selectMyChannelClaims,
  selectFetchingMyChannels,
  makeSelectTagInClaimOrChannelForUri,
} from 'redux/selectors/claims';
import { CommentCreate } from './view';
import { DISABLE_SUPPORT_TAG } from 'constants/tags';
import { doCommentCreate, doFetchCreatorSettings, doCommentById } from 'redux/actions/comments';
import { doSendTip, doSendCashTip } from 'redux/actions/wallet';
import { doToast } from 'redux/actions/notifications';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectSettingsByChannelId } from 'redux/selectors/comments';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  channels: selectMyChannelClaims(state),
  isFetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  settingsByChannelId: selectSettingsByChannelId(state),
  supportDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_SUPPORT_TAG)(state),
});

const perform = (dispatch, ownProps) => ({
  createComment: (comment, claimId, parentId, txid, payment_intent_id, environment, sticker) =>
    dispatch(
      doCommentCreate(
        comment,
        claimId,
        parentId,
        ownProps.uri,
        ownProps.livestream,
        txid,
        payment_intent_id,
        environment,
        sticker
      )
    ),
  sendTip: (params, callback, errorCallback) => dispatch(doSendTip(params, false, callback, errorCallback, false)),
  sendCashTip: (tipParams, userParams, claimId, environment, successCallback) =>
    dispatch(doSendCashTip(tipParams, false, userParams, claimId, environment, successCallback)),
  doToast: (options) => dispatch(doToast(options)),
  doFetchCreatorSettings: (channelClaimId) => dispatch(doFetchCreatorSettings(channelClaimId)),
  fetchComment: (commentId) => dispatch(doCommentById(commentId, false)),
});

export default connect(select, perform)(CommentCreate);
