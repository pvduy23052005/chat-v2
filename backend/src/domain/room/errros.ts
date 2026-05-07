import { DomainError } from "../shared/errors/domain.errors";

export class InvalidFriendRequstError extends DomainError {
  constructor(message = 'Không thể tự gửi lời mời kết bạn cho chính mình') {
    super(message);
  }
}

export class FriendRequestStatusError extends DomainError {
  constructor(message = ' Trạng thái lời mời không hợp lệ để thực hiện thao tác này') {
    super(message);
  }
}