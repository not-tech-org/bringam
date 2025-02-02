export const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
  return regex.test(password);
};

