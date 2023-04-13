import { submitTempLink } from '@app/redux/links/actions';
import { tempLink } from '@app/redux/links/fixtures';
import { LoadingState } from '@app/redux/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Claim, Link } from './types';

interface LinksState {
  list: Link[];
  tempLink: Link;
  loading: LoadingState;
}

const initialState: LinksState = {
  list: [],
  tempLink: tempLink,
  loading: LoadingState.IDLE,
};

const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    setLinks: (state, action: PayloadAction<Link[]>) => ({
      ...state,
      list: action.payload,
    }),
    setTempLink: (state, action: PayloadAction<Link>) => ({
      ...state,
      tempLink: action.payload,
    }),
    addLink: (state, action: PayloadAction<Link>) => ({
      ...state,
      list: [...state.list, action.payload],
    }),
    updateLink: (state, action: PayloadAction<Link>) => ({
      ...state,
      list: state.list.map((link) => (link.id === action.payload.id ? action.payload : link)),
    }),
    updateClaim: (state, action: PayloadAction<{ link: Link; claim: Claim }>) => ({
      ...state,
      list: state.list.map((link) =>
        link.id === action.payload.link.id
          ? {
              ...link,
              claims: link.claims.map((claim) =>
                claim.internalId === action.payload.claim.internalId ? action.payload.claim : claim
              ),
            }
          : link
      ),
    }),
    updateTempClaim: (state, action: PayloadAction<{ claim: Claim }>) => ({
      ...state,
      tempLink: {
        ...state.tempLink,
        claims: state.tempLink.claims.map((claim) =>
          claim.id === action.payload.claim.id ? action.payload.claim : claim
        ),
      },
    }),
    resetTempLink: (state) => ({
      ...state,
      tempLink,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(submitTempLink.pending, (state) => ({
      ...state,
      loading: LoadingState.PENDING,
    }));
    builder.addCase(submitTempLink.fulfilled, (state) => ({
      ...state,
      loading: LoadingState.SUCCESS,
    }));
    builder.addCase(submitTempLink.rejected, (state) => ({
      ...state,
      loading: LoadingState.FAILURE,
    }));
  },
});

export const {
  setLinks,
  setTempLink,
  addLink,
  updateLink,
  updateClaim,
  updateTempClaim,
  resetTempLink,
} = linksSlice.actions;
export default linksSlice.reducer;
