import {
    CallHandler,
    Controller,
    ExecutionContext,
    Get,
    HttpCode,
    HttpStatus,
    Injectable,
    NestInterceptor,
    ParseIntPipe,
    Post,
    Query,
    Param,
    Redirect,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
class UsersGuard {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return Boolean(request.headers["x-user-id"]);
    }
}

@Injectable()
class ResponseInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(map((data: unknown) => ({ data })));
    }
}

@Controller("/users")
export class UserController {
    @Get("/profile")
    @HttpCode(HttpStatus.OK)
    getProfile() {
        return { hello: "world" };
    }

    @Post("/profile")
    @Redirect()
    redirectProfile() {
        const destination = Math.floor(Math.random() * 10) + 1 < 5
            ? "/users/wallet"
            : "/users/account";

        return {
            url: destination,
            statusCode: 302,
        };
    }

    @Get("/account")
    getAccount() {
        return "Working account";
    }

    @Get("/wallet")
    getWallet() {
        return "Working wallet";
    }

    @Get("/videos")
    getVideos(@Query() query: Record<string, unknown>) {
        console.log(query);
        return "Success";
    }

    @Get("/videos/:id")
    @UseGuards(UsersGuard)
    @UseInterceptors(ResponseInterceptor)
    getVideo(@Param("id", ParseIntPipe) id: number) {
        return { id };
    }
}








