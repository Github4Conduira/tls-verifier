import uuid from 'react-native-uuid';
import { Link } from '@app/redux/links/types';

// export const links: Link[] = [
//   {
//     id: '1',
//     userId: 'ando.eth',
//     name: 'YC Application',
//     createdAtS: 1675673458,
//     views: 10,
//     claims: [
//       {
//         id: 1,
//         redactedParameters: '*****@creatoros.co',
//         ownerPublicKey: 'new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])',
//         timestampS: 1675673458,
//         witnessAddresses: ['witnessAddress_0001', 'witnessAddress_0002'],
//         status: ClaimStatus.MINTED,
//         provider: 'google-login',
//         params: {
//           email: 'example@mail.com',
//         },
//       },
//     ],
//   },
//   {
//     id: '2',
//     name: 'Questbook Resume',
//     createdAtS: 1675270119,
//     userId: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
//     views: 11,
//     claims: [
//       {
//         id: 2,
//         redactedParameters: '*****@gmail.com',
//         ownerPublicKey: 'new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])',
//         timestampS: 1675270119,
//         witnessAddresses: ['witnessAddress_0001', 'witnessAddress_0002'],
//         status: ClaimStatus.MINTED,
//         provider: 'github-repo',
//         params: {
//           email: 'example@mail.com',
//         },
//       },
//       {
//         id: 3,
//         redactedParameters: '*****@google.com',
//         ownerPublicKey: 'new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])',
//         timestampS: 1675270119,
//         witnessAddresses: ['witnessAddress_0001', 'witnessAddress_0002'],
//         status: ClaimStatus.MINTED,
//         provider: 'google-login',
//         params: {
//           email: 'example@mail.com',
//         },
//       },
//     ]
//   }
// ];

export const tempLink: Link = {
  id: uuid.v4().toString(),
  name: '',
  claims: [],
  userId: 'tempId',
  createdAtS: Math.floor(Date.now() / 1000),
  views: 0,
};
