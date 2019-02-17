const defaultMessage = 'Are you sure?';

const defaultOptions = {
  okText: 'OK',
  cancelText: 'Cancel'
};

export const withConfirmation = (message = defaultMessage, options = defaultOptions) => ({
  do: async (fn) => {
    try {
      await Vue.dialog.confirm(message, options);
      return await fn();
    } catch (e) {
      // not confirmed, do nothing
    }
  }
});
