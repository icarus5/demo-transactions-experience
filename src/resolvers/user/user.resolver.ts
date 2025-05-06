import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../commons/dto/transaction.dto';
import { UserService } from '../../services/user';
import { catchError, map, Observable, throwError } from 'rxjs';

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
}
