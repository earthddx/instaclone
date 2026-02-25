import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Platform,
  Keyboard,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/colors";

const DISMISS_THRESHOLD = 120;

/**
 * Reusable animated bottom sheet with drag-to-dismiss gesture.
 * Used by CommentsSheet and FollowListSheet.
 *
 * Props:
 *   visible       – boolean
 *   onClose       – () => void — called after the slide-out animation finishes,
 *                   for ALL dismiss sources (backdrop tap, swipe, Android back, ref.close)
 *   title         – string shown in the header
 *   heightRatio   – fraction of screen height (default 0.78)
 *   centerTitle   – bool (default false) — center title text (CommentsSheet style)
 *   showCloseBtn  – bool (default false) — X button top-right (FollowListSheet style)
 *   keyboardAware – bool (default false) — slide sheet up when keyboard opens
 *   children      – rendered inside the sheet below the header
 *
 * Ref API (via React.forwardRef):
 *   sheetRef.current.close(extraCallback?)
 *     Animates the sheet out, calls onClose, then calls extraCallback.
 *     Use this for programmatic close with a follow-up action (e.g. navigation).
 */
const BottomSheet = React.forwardRef(function BottomSheet(
  {
    visible,
    onClose,
    title,
    heightRatio = 0.78,
    centerTitle = false,
    showCloseBtn = false,
    keyboardAware = false,
    children,
  },
  ref
) {
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const SHEET_HEIGHT = screenHeight * heightRatio;

  const translateY = React.useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const keyboardPadding = React.useRef(new Animated.Value(0)).current;

  // Always read the latest onClose so animation callbacks never stale-close
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // closeSheet defined with useCallback; kept in a ref so PanResponder always
  // calls the latest version without being re-created itself.
  const closeSheet = React.useCallback(
    (extraCallback) => {
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 260,
        useNativeDriver: true,
      }).start(() => {
        onCloseRef.current?.();
        extraCallback?.();
      });
    },
    [SHEET_HEIGHT, translateY]
  );

  const closeSheetRef = React.useRef(closeSheet);
  React.useEffect(() => { closeSheetRef.current = closeSheet; }, [closeSheet]);

  // Expose ref API
  React.useImperativeHandle(ref, () => ({
    close: (extraCallback) => closeSheetRef.current(extraCallback),
  }), []);

  // Spring-in whenever the sheet becomes visible
  React.useEffect(() => {
    if (!visible) return;
    translateY.setValue(SHEET_HEIGHT);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [visible]);

  // Keyboard-driven bottom padding (opt-in)
  React.useEffect(() => {
    if (!keyboardAware) return;
    keyboardPadding.setValue(insets.bottom);
    const showEv = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEv = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const onShow = Keyboard.addListener(showEv, (e) => {
      Animated.timing(keyboardPadding, {
        toValue: e.endCoordinates.height,
        duration: e.duration ?? 250,
        useNativeDriver: false,
      }).start();
    });
    const onHide = Keyboard.addListener(hideEv, (e) => {
      Animated.timing(keyboardPadding, {
        toValue: insets.bottom,
        duration: e.duration ?? 250,
        useNativeDriver: false,
      }).start();
    });
    return () => { onShow.remove(); onHide.remove(); };
  }, [keyboardAware, insets.bottom]);

  // PanResponder created once; closeSheetRef ensures latest closeSheet is called
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 2,
      onPanResponderMove: (_, { dy }) => { if (dy > 0) translateY.setValue(dy); },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > DISMISS_THRESHOLD || vy > 0.8) {
          closeSheetRef.current();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={() => closeSheetRef.current()}
    >
      <View style={{ flex: 1 }}>
        {/* Dim backdrop */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          activeOpacity={1}
          onPress={() => closeSheetRef.current()}
        />

        {/* Animated sheet */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: SHEET_HEIGHT,
            backgroundColor: Colors.surface.DEFAULT,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
            transform: [{ translateY }],
          }}
        >
          <Animated.View
            style={[
              { flex: 1 },
              keyboardAware && { paddingBottom: keyboardPadding },
            ]}
          >
            {/* Drag handle */}
            <View
              {...panResponder.panHandlers}
              style={{ alignItems: "center", paddingVertical: 12 }}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: Colors.muted.DEFAULT,
                }}
              />
            </View>

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: Colors.surface[300],
              }}
            >
              {centerTitle ? (
                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  {title}
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      flex: 1,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    {title}
                  </Text>
                </>
              )}
            </View>
            {/* Consumer content */}
            {children}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
});

export default BottomSheet;
