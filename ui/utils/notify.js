// holds all past notifications
export const notificationHistory = [];

export const notify = (type, text) => {
  notificationHistory.unshift({ ts: new Date().getTime(), type, text });
  Vue.$awn[type](text);
};
