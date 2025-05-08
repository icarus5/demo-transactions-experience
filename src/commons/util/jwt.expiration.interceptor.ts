import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { decode, verify } from 'jsonwebtoken';
import { Request } from 'express';

// Define una interfaz para el payload del token
interface JwtPayload {
  exp?: number;
  sub?: string;
  iat?: number;
  // Otras propiedades que esperes en tu token
}

@Injectable()
export class JwtAuthInterceptor implements NestInterceptor {
  //private readonly jwtPublicKey: string = process.env.JWT_PUBLIC || '';
  private readonly jwtPublicKey: string = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtVKUtcx/n9rt5afY/2WF
NvU6PlFMggCatsZ3l4RjKxH0jgdLq6CScb0P3ZGXYbPzXvmmLiWZizpb+h0qup5j
znOvOr+Dhw9908584BSgC83YacjWNqEK3urxhyE2jWjwRm2N95WGgb5mzE5XmZIv
kvyXnn7X8dvgFPF5QwIngGsDG8LyHuJWlaDhr/EPLMW4wHvH0zZCuRMARIJmmqiM
y3VD4ftq4nS5s8vJL0pVSrkuNojtokp84AtkADCDU/BUhrc2sIgfnvZ03koCQRoZ
mWiHu86SuJZYkDFstVTVSR0hiXudFlfQ2rOhPlpObmku68lXw+7V+P7jwrQRFfQV
XwIDAQAB
-----END PUBLIC KEY-----
`;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Determinar si es una solicitud HTTP o GraphQL
    const isGraphQL = context.getType().toString() === 'graphql';
    let request: Request;

    if (isGraphQL) {
      // Para GraphQL, obtenemos el contexto de GraphQL
      const gqlContext = GqlExecutionContext.create(context);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      request = gqlContext.getContext().req;
    } else {
      // Para HTTP tradicional
      request = context.switchToHttp().getRequest();
    }

    // Extraer el token JWT de la solicitud
    const token = this.extractTokenFromRequest(request);

    // Si no hay token, lanzar excepción (o podrías hacer esto condicional según tus rutas)
    if (!token) {
      throw new UnauthorizedException('No JWT token provided');
    }

    try {
      // Decodificar el token sin verificar para obtener el tiempo de expiración
      const decodedToken = decode(token) as JwtPayload;

      if (!decodedToken) {
        throw new UnauthorizedException('Invalid JWT token format');
      }

      // Verificar la expiración
      if (decodedToken.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          throw new UnauthorizedException('JWT token has expired');
        }
      }
      verify(token, this.jwtPublicKey, {
        algorithms: ['RS256'],
      });

      // Si todo está bien, añadir la información del usuario al contexto
      if (isGraphQL) {
        const gqlContext = GqlExecutionContext.create(context);
        gqlContext.getContext().user = decodedToken;
      } else {
        request['user'] = decodedToken;
      }

      // Continuar con la ejecución
      return next.handle();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    // Intenta extraer el token del encabezado Authorization
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      return request.headers.authorization.split(' ')[1];
    }

    // Intenta extraer de query params
    if (request.query && request.query.token) {
      return request.query.token as string;
    }

    // Intenta extraer del cuerpo
    if (request.body && request.body.token) {
      return request.body.token as string;
    }

    return undefined;
  }
}
