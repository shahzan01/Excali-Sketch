-- DropForeignKey
ALTER TABLE "RoomState" DROP CONSTRAINT "RoomState_roomId_fkey";

-- AddForeignKey
ALTER TABLE "RoomState" ADD CONSTRAINT "RoomState_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
