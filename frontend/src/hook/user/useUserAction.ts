import { userServiceSocket } from "../../socket/services/userServiceSocket";

export const useUserAction = () => {
  const handleChatNotFriend = (userID: string): void => {
    userServiceSocket.chatNotFriend(userID);
  };

  const handleFriendRequest = (userID: string): void => {
    userServiceSocket.friendRequest(userID);
  };

  const handleFriendCancel = (userID: string): void => {
    userServiceSocket.cancelRequest(userID);
  };

  const handleFriendRefuse = (userID: string): void => {
    userServiceSocket.refuseFriend(userID);
  };

  const handleFriendAccept = (userID: string): void => {
    userServiceSocket.acceptFriend(userID);
  };

  return {
    handleChatNotFriend,
    handleFriendRequest,
    handleFriendCancel,
    handleFriendRefuse,
    handleFriendAccept,
  };
};
