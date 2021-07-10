import { Body, Controller, Get, Logger, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller("api/v1")
export class AppController {

  private logger = new Logger(AppController.name);

  private clientAdminBakcend: ClientProxy;

  constructor() {
    this.clientAdminBakcend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls:['amqp://user:bitnami@localhost:5672/smartranking'],
        queue: 'admin-backend'
      }
    })
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  criarCategoria(
    @Body() criarCategoriaDTO: CriarCategoriaDto){
      this.clientAdminBakcend.emit('criar-categoria', criarCategoriaDTO);
  }

  @Get('categorias')
  consultarCategorias(@Query("idCategoria") _id: string): Observable<any>{
    return this.clientAdminBakcend.send('consultar-categorias', _id? _id: '');
  }


}
