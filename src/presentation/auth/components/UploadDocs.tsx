import { Text, TouchableOpacity, View } from 'react-native';
import { useController, useFormContext } from 'react-hook-form';
import UploadIcon from '../../../../assets/icons/Download_light.svg';
import { DocPicker } from '../../../shared/components/DocPicker';
export type UploadDocsProps = {
  label: string
  name: string
}

export default function UploadDocs({ label, name }: UploadDocsProps) {
  const { control } = useFormContext()
  const { field } = useController({ name, control })

  const handlePickFile = async () => {
    const file = await DocPicker()
    if (file) field.onChange(file)
  }
  return (
    <TouchableOpacity onPress={handlePickFile}>
      <Text>{label}</Text>
      <View>
        <UploadIcon height={20} width={20} />
        <Text>{field?.name || 'Upload'}</Text>
      </View>
    </TouchableOpacity>
  )
}
