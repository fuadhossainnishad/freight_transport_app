import { Text, TouchableOpacity, View } from 'react-native';
import { PickedFile } from '../../../shared/hooks/useDocPicker';

export type UploadDocsProps = {
  label: string
  name: string
  file: PickedFile
}

export default function UploadDocs({ }) {
  return (
    <TouchableOpacity>
      <Text>{label}</Text>
      <View>

      </View>
    </TouchableOpacity>
  )
}
