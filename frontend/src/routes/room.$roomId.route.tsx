import { createFileRoute } from '@tanstack/react-router';
import { RoomPage } from '../pages/RoomPage';

export const Route = createFileRoute('/room/$roomId')({
  component: RoomPage,
});
