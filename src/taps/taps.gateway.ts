import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { TapsService } from './taps.service';
import { CreateTapDto } from './dto/create-tap.dto';
import { UpdateTapDto } from './dto/update-tap.dto';
import { Server } from 'socket.io';

@WebSocketGateway()
export class TapsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tapsService: TapsService) { }

  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() data: string) {
    this.server.sockets.emit('receive_message', data);
  }

  @SubscribeMessage('createTap')
  create(@MessageBody() createTapDto: CreateTapDto) {
    return this.tapsService.create(createTapDto);
  }

  @SubscribeMessage('findAllTaps')
  findAll() {
    return this.tapsService.findAll();
  }

  @SubscribeMessage('findOneTap')
  findOne(@MessageBody() id: number) {
    return this.tapsService.findOne(id);
  }

  @SubscribeMessage('updateTap')
  update(@MessageBody() updateTapDto: UpdateTapDto) {
    return this.tapsService.update(updateTapDto.id, updateTapDto);
  }

  @SubscribeMessage('removeTap')
  remove(@MessageBody() id: number) {
    return this.tapsService.remove(id);
  }
}
