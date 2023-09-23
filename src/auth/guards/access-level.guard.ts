import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  ACCESS_LEVEL_KEY,
  ADMIN_KEY,
  PUBLIC_KEY,
  ROLES_KEY,
} from '../../constants/key-decorators';
import { ACCESS_LEVEL, ROLES } from '../../constants/roles';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    const accessLevel = this.reflector.get<keyof typeof ACCESS_LEVEL>(
      ACCESS_LEVEL_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

    const req = context.switchToHttp().getRequest<Request>();

    const { roleUser, idUser } = req;

    if (accessLevel === undefined) {
      if (roles === undefined) {
        if (!admin) {
          return true;
        } else if (admin && roleUser === admin) {
          return true;
        } else {
          throw new UnauthorizedException(
            'No tienes permisos para esta operacion',
          );
        }
      }
    }
    console.log('roleUser: ',roleUser);
    if (roleUser === ROLES.ADMIN || roleUser === ROLES.CREATOR) {
      return true;
    }

    const user = (await this.userService.findUserById(idUser));

    /* const userExistInProject = user.projectsIncludes.find(
      (project) => project.project.id === req.params.projectId,
    ); */
    const userExistInProject = (user.projectsIncludes.project?.id === req.params.projectId)? user.projectsIncludes : undefined;
    // TODO: Resuelto 
    console.log('userExistInProject: ',user.projectsIncludes[0].accessLevel);
    console.log('ACCESS_LEVEL: ', ACCESS_LEVEL[accessLevel]);
    if (userExistInProject === undefined) {
      throw new UnauthorizedException('No formas parte del proyecto');
    }

    // DEVELOPER = 30,
    // MANTEINER = 40,
    // OWNER = 50,

    //30 > 40
    if (ACCESS_LEVEL[accessLevel] > userExistInProject.accessLevel) {
      throw new UnauthorizedException('No tienes el nivel de acceso necesario');
    }

    /* if (ACCESS_LEVEL[accessLevel] !== userExistInProject[0]?.accessLevel) {
      throw new UnauthorizedException('No tienes el nivel de acceso necesario');
    } */

    return true;
  }
}