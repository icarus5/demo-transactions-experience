import { Injectable } from '@nestjs/common';
import { Transaction, User } from '../../commons/dto/transaction.dto';
import axios, { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class UserService {
  private readonly apiUrl = 'http://localhost:3030';

  constructor(private readonly httpService: HttpService) {}

  // Example method
  getUserById(userId: string): Observable<User> {
    /* const response = await axios.get<User>(`${this.apiUrl}/users/${userId}`);
     console.log(JSON.stringify(response.data));
     return response.data;*/
    return this.httpService.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
      map((response: AxiosResponse<User>) => response.data),
      catchError((error: unknown) => {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching users:', error.message);
        }
        return throwError(() => new Error('Error retrieving users'));
      }),
    );
  }

  // Add more methods as needed
  getAllUsers(): User[] {
    return []; // Replace with actual logic to fetch all users
  }
}
