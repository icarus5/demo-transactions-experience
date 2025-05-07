import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../commons/dto/transaction.dto';
import { UserService } from '../../services/user';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SignIn, SignInResponse, UserInfo } from 'src/commons/dto/singin.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Query(() => User, { name: 'userById' })
  getUserById(@Args('id', { type: () => String }) id: string): Observable<User> {
    const user = this.userService.getUserById(id).pipe(
      map((response: User) => response),
      catchError((error: unknown) => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('Error retrieving user'));
      }),
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Query(() => SignInResponse, { name: 'signIn' })
  signIn(@Args('login', { type: () => SignIn }) user: SignIn): Observable<SignInResponse> {
    const signIn = this.userService.signIn(user).pipe(
      map((response: SignInResponse) => response),
      catchError((error: unknown) => {
        console.error('Error signing in:', error);
        return throwError(() => new Error('Error signing in'));
      }),
    );
    if (!signIn) {
      throw new Error('Sign in failed');
    }
    return signIn;
  }

  @Query(() => UserInfo, { name: 'userInfo' })
  userInfo(@Args('user', { type: () => String }) token: string): Observable<UserInfo> {
    const signIn = this.userService.getUserInfo(token).pipe(
      map((response: UserInfo) => response),
      catchError((error: unknown) => {
        console.error('Error signing in:', error);
        return throwError(() => new Error('Error signing in'));
      }),
    );
    if (!signIn) {
      throw new Error('Sign in failed');
    }
    return signIn;
  }
}
