import { TransactionService } from '../../services/transaction/transaction.service';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Transaction, User } from '../../commons/dto/transaction.dto';
import { CreateTransactionInput } from '../../commons/model/create-transaction.input';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { UserService } from '../../services/user';

@Resolver(() => Transaction)
export class TransactionResolvers {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {}

  @Query(() => Transaction, { name: 'transactionById' })
  async getTransactionId_old(@Args('id', { type: () => String }) id: string) {
    let resp = await this.transactionService.getTransactionById_old(id);
    resp.user = new User();
    return {
      ...resp,
      fecha: resp.fecha ? new Date(resp.fecha) : null,
      createdAt: resp.createdAt ? new Date(resp.createdAt) : null,
      updatedAt: resp.updatedAt ? new Date(resp.updatedAt) : null,
      user: resp.user ?? null,
    };
  }

  @Query(() => Transaction, { name: 'transactionById' })
  getTransactionId(@Args('id', { type: () => String }) id: string): Observable<Transaction> {
    return this.transactionService.getTransactionById(id).pipe(
      switchMap((resp) => {
        console.log('transactionById', JSON.stringify(resp));
        return this.userService.getUserById(resp.userId).pipe(
          map((user) => {
            resp.user = user;
            return {
              ...resp,
              fecha: resp.fecha ? new Date(resp.fecha) : null,
              createdAt: resp.createdAt ? new Date(resp.createdAt) : null,
              updatedAt: resp.updatedAt ? new Date(resp.updatedAt) : null,
              user: resp.user ?? null,
            };
          }),
        );
      }),
    );
  }

  @Query(() => [Transaction], { name: 'transactionByUser' })
  getTransactionByUser(
    @Args('userId', { type: () => String }) id: string,
  ): Observable<Transaction[]> {
    return this.transactionService.getTransactionByUserId(id).pipe(
      switchMap((transactions) => {
        // Si no hay transacciones, retornamos un array vacío
        if (!transactions || transactions.length === 0) {
          return of([]);
        }
        // Enriquecer cada transacción con el usuario
        return forkJoin(
          transactions.map((transaction) =>
            this.userService.getUserById(transaction.userId).pipe(
              map((user) => ({
                ...transaction,
                fecha: transaction.fecha ? new Date(transaction.fecha) : null,
                createdAt: transaction.createdAt ? new Date(transaction.createdAt) : null,
                updatedAt: transaction.updatedAt ? new Date(transaction.updatedAt) : null,
                user: user ?? null,
              })),
            ),
          ),
        );
      }),
    );
  }

  @Query(() => [Transaction], { name: 'transactionByUser2Metodo' })
  getTransactionByUser2Metodo(
    @Args('userId', { type: () => String }) id: string,
  ): Observable<Transaction[]> {
    return this.transactionService.getTransactionByUserId(id).pipe(
      switchMap((transactions) => {
        if (!transactions || transactions.length === 0) {
          return of([]);
        }
        return this.userService.getUserById(id).pipe(
          map((user) =>
            transactions.map((transaction) => ({
              ...transaction,
              fecha: transaction.fecha ? new Date(transaction.fecha) : null,
              createdAt: transaction.createdAt ? new Date(transaction.createdAt) : null,
              updatedAt: transaction.updatedAt ? new Date(transaction.updatedAt) : null,
              user: user ?? null,
            })),
          ),
        );
      }),
    );
  }

  @Mutation(() => Transaction, { name: 'createTransaction' })
  async saveTransaction(@Args('input') input: CreateTransactionInput) {
    console.log(JSON.stringify(input));
    const operation = await this.transactionService.saveTransaction(input);
    operation.user = new User();
    return {
      ...operation,
      fecha: operation.fecha ? new Date(operation.fecha) : null,
      createdAt: operation.createdAt ? new Date(operation.createdAt) : null,
      updatedAt: operation.updatedAt ? new Date(operation.updatedAt) : null,
      user: operation.user ?? null,
    };
  }
}
