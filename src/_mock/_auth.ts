// _mock
import { _mock } from 'src/_mock';

// ----------------------------------------------------------------------

export const JWT_SECRET = 'mactorium-secret-key';

export const JWT_EXPIRES_IN = '3 days';

export const _users = [
  {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Warayut Taekrathok',
    email: 'demo@mactoriums.cc',
    password: 'demo1234',
    photoURL: _mock.image.avatar(24),
    phoneNumber: '+40 777666555',
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
  },
];
