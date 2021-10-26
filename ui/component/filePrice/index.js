import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectClaimWasPurchased, makeSelectClaimIsMine } from 'redux/selectors/claims';
import { makeSelectCostInfoForUri, doFetchCostInfoForUri, makeSelectFetchingCostInfoForUri } from 'lbryinc';
import FilePrice from './view';

const select = (state, props) => ({
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  fetching: makeSelectFetchingCostInfoForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  claimWasPurchased: makeSelectClaimWasPurchased(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

export default connect(select, { doFetchCostInfoForUri })(FilePrice);
