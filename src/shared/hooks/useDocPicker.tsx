import { launchImageLibrary } from 'react-native-image-picker';

export type PickedFile = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};
export const useDocPicker = async ({ uri, name, type, size }: PickedFile) => {
  const res = await launchImageLibrary({
    mediaType: 'mixed',
    selectionLimit: 1,
  });
  if (res.didCancel) {
    return null;
  }
  return { uri, name, type, size };
};
