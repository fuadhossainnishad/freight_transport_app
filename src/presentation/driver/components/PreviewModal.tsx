import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native';

export interface PreviewModalProps {
  imageUrl: string
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}

const { height: SCREEN_H } = Dimensions.get('window');

/**
 * Full-bleed document preview.
 *
 * Sized with StyleSheet, not NativeWind classNames, on purpose: the image
 * previously took its only dimensions from `className="w-full h-72"`. When those
 * classes did not apply the <Image> collapsed to 0x0 and the document silently
 * rendered as nothing — the modal opened onto an empty box.
 */
export default function PreviewModal({ imageUrl, show, setShow }: PreviewModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const close = () => setShow(false);

  return (
    <Modal
      visible={show}
      transparent
      animationType="fade"
      onRequestClose={close}
      // Let the image use the full screen on Android rather than being clipped.
      statusBarTranslucent
    >
      {/* Tap the backdrop to dismiss — standard for a lightbox. */}
      <Pressable style={styles.backdrop} onPress={close}>
        {/* Swallow taps on the card so they don't close the modal. */}
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {t('driver.preview.title')}
            </Text>
            <TouchableOpacity
              onPress={close}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              style={styles.closeButton}
            >
              <X size={20} color="#1A1C1E" />
            </TouchableOpacity>
          </View>

          <View style={styles.imageWrap}>
            {loading && !failed && (
              <ActivityIndicator style={styles.loader} size="large" color="#036BB4" />
            )}

            {failed ? (
              <Text style={styles.error}>{t('driver.preview.loadFailed')}</Text>
            ) : (
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="contain"
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setFailed(true);
                }}
              />
            )}
          </View>

          <TouchableOpacity onPress={close} style={styles.closeCta} activeOpacity={0.85}>
            <Text style={styles.closeCtaText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  imageWrap: {
    // Explicit height: a licence photo is the whole point of this screen, so it
    // must never depend on a style that might not resolve.
    height: Math.min(SCREEN_H * 0.55, 420),
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
  },
  error: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  closeCta: {
    marginTop: 12,
    backgroundColor: '#1A1C1E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
