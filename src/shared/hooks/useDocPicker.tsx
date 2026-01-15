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
  if (res.didCancel && !res.assets?.length) {
    return null;
  }

  const file = res.assets?.[0];
  if (!file?.uri || !file.type || !file.fileName) {
    return null;
  }
  return {
    uri: file.uri!,
    name: file.fileName,
    type: file.type || 'application/octet-stream',
    size: file.fileSize
  };
};
