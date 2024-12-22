const amplifyPath = process.env.NEXT_PUBLIC_AMPLIFY_URL;

export const createAvatarPath = (userId: string) => {
  return `${amplifyPath}/avatars/${userId}/avatar.jpg`;
};
