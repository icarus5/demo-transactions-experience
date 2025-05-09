import { Injectable } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import axios, { AxiosResponse } from 'axios';
import * as https from 'https';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable, throwError } from 'rxjs';
import { B2CConfig } from 'src/commons/util/constants.util';
import { SignIn, SignInResponse, UserInfo, UserInfoB2CDto } from 'src/commons/dto/singin.dto';
import { User } from '../../commons/dto/transaction.dto';

@Injectable()
export class UserService {
  private readonly apiUrl = 'http://localhost:3030';
  private readonly apiB2CUrl = `https://${B2CConfig.AZURE_B2C_TENNANT}.b2clogin.com/${B2CConfig.AZURE_B2C_TENNANT}.onmicrosoft.com/${B2CConfig.AZURE_B2C_ROPC}/oauth2/v2.0/token`;

  constructor(private readonly httpService: HttpService) {}

  getUserById(userId: string): Observable<User> {
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

  getUserByDocument(document: string): Observable<User> {
    return this.httpService.get<User>(`${this.apiUrl}/users/document/${document}`).pipe(
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

  signIn(user: SignIn): Observable<SignInResponse> {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Ignorar certificados no válidos
    });

    console.log('signIn : ', JSON.stringify(user));
    console.log('apiB2CUrl : ', this.apiB2CUrl);
    return this.httpService
      .post<SignInResponse>(`${this.apiB2CUrl}`, user, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        httpsAgent: httpsAgent,
        params: this.createUserTokenRequestBody(user.username, user.password),
      })
      .pipe(
        map((response: AxiosResponse<SignInResponse>) => {
          console.log('Response from B2C:', JSON.stringify(response.data));
          return response.data;
        }),
        catchError((error: unknown) => {
          if (axios.isAxiosError(error)) {
            console.error('Error fetching users:', error.message);
          }
          return throwError(() => new Error('Error retrieving users'));
        }),
      );
  }

  getUserInfo(accessToken: string): Observable<UserInfo | null> {
    try {
      const userInfo = this.processIdToken(accessToken); // Llama a tu método privado
      return new Observable((observer) => {
        // Envuelve el resultado síncrono en un Observable
        observer.next(userInfo);
        observer.complete();
      });
    } catch (error) {
      return throwError(() => error); // Propaga cualquier error desde processIdToken
    }
    /*return this.httpService
      .get<any>(`${this.apiB2CUrl}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        httpsAgent: httpsAgent,
      })
      .pipe(
        map((response: AxiosResponse<any>) => {
          console.log('User Info:', response.data);
          return response.data;
        }),
        catchError((error: unknown) => {
          if (axios.isAxiosError(error)) {
            console.error('Error fetching user info:', error.message);
          }
          return throwError(() => new Error('Error retrieving user info'));
        }),
      );*/
  }

  private createUserTokenRequestBody(username: string, password: string): URLSearchParams {
    return new URLSearchParams({
      client_id: B2CConfig.AUTH_CLIENT_ID!,
      grant_type: 'password',
      scope: `openid ${B2CConfig.AUTH_CLIENT_ID} offline_access`,
      username: `${username}`,
      password: `${password}`,
      response_type: 'token id_token',
    });
  }

  private processIdToken(idToken: string): UserInfo | null {
    try {
      const decodedToken = decode(idToken) as UserInfoB2CDto; // 'any' para acceder a las propiedades
      if (!decodedToken) {
        console.error('Error al decodificar el ID token.');
        return null;
      }
      return {
        oid_azure_b2c: decodedToken.oid,
        sub: decodedToken.sub,
        document: decodedToken.name,
        fullName: decodedToken.family_name,
        userId: '',
      };
    } catch (error) {
      console.error('Error al procesar el ID token:', error);
      return null;
    }
  }
}
