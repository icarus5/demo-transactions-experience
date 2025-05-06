import { Injectable } from '@nestjs/common';
import { Transaction } from '../../commons/dto/transaction.dto';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosResponse } from 'axios';

import { CreateTransactionInput } from '../../commons/model/create-transaction.input';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class TransactionService {
  private readonly apiUrl = 'http://localhost:3030';

  constructor(private readonly httpService: HttpService) {}

  async getTransactionById_old(id: string): Promise<Transaction> {
    const response = await axios.get<Transaction>(`${this.apiUrl}/transactions/${id}`);
    console.log(JSON.stringify(response.data));
    return response.data;
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.httpService.get<Transaction>(`${this.apiUrl}/transactions/${id}`).pipe(
      map((response: AxiosResponse<Transaction>) => response.data),
      catchError((error: unknown) => {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching transaction:', error.message);
        }
        return throwError(() => new Error('Error retrieving transaction'));
      }),
    );
  }

  async saveTransaction(transaction: CreateTransactionInput): Promise<Transaction> {
    const transactionData = { ...transaction, createUser: 'admin', createdAt: new Date() };
    const response = await axios.post<Transaction>(`${this.apiUrl}/transactions`, transactionData);
    console.log(JSON.stringify(response.data));
    return response.data;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const response = await axios.get<Transaction[]>(`${this.apiUrl}/transactions`);
    console.log(JSON.stringify(response.data));
    return response.data;
  }

  async deleteTransaction(id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/transactions/${id}`);
  }
}
