import { Body, Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
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
  async criarCategoria(
    @Body() criarCategoriaDTO: CriarCategoriaDto){
      return await this.clientAdminBakcend.emit('criar-categoria', criarCategoriaDTO)
  }


}
