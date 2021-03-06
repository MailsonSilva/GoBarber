import UserToken from '../../infra/typeorm/entities/UserToken';
import { uuid } from 'uuidv4';
import IUserTokensRepository from '../IUserTokensRepository';

class FakeUsersTokensRepository implements IUserTokensRepository{
  private userTokens: UserToken[]=[];

  public async generate(user_id: string): Promise<UserToken>{
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined>{
    const userToken = this.userTokens.find(findToken => findToken.token === token);

    return userToken;
  }
}

export default FakeUsersTokensRepository;
