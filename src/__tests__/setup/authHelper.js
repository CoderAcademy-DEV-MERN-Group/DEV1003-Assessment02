import User from '../../models/User';
import { generateToken } from '../../utils/auth';
import { userFixture } from './fixtures';

// Use this to generate a user with an authentication token, going to be helpful for user tests
const getAuthToken = async () => {
  const user = await User.create(userFixture());
  const token = generateToken(user);
  return token;
};

export default getAuthToken;
