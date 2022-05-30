import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from 'src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  
  constructor(private usersService: UsersService, private router: Router){}
  
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    console.log("CanLoad AuthGuard: strážim URL " + route.path);
    return this.canAnything(route.path || '');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      console.log("CanActivate AuthGuard: strážim URL " + state.url);
      return this.canAnything(state.url);
  }

  canAnything(url: string): Observable<boolean> | boolean {
    if (this.usersService.isLoggedId()) {
      return true;
    }
    this.usersService.redirectAfterLogin = url;
    this.router.navigateByUrl("/login");
    return false;
  }
  
}
