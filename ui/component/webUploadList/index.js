import { connect } from 'react-redux';
import { selectCurrentUploads, selectUploadCount, doUpdateUploadRemove } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';
import { doPublishResume } from 'redux/actions/publish';
import WebUploadList from './view';

const select = (state) => ({
  currentUploads: selectCurrentUploads(state),
  uploadCount: selectUploadCount(state),
});

const perform = (dispatch) => ({
  doPublishResume: (publishPayload) => dispatch(doPublishResume(publishPayload)),
  doUpdateUploadRemove: (params) => dispatch(doUpdateUploadRemove(params)),
  doOpenModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(WebUploadList);
