import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform
} from 'react-native';
import {
  compose,
  withProps,
  withHandlers,
  lifecycle,
  pure
} from 'recompose';
import BottomSheet from 'reanimated-bottom-sheet';

const COLOR1 = '#f7f5eee8';
const COLOR2 = '#00000040';
const BLACK = '#000000';

const styles = StyleSheet.create({
  panel: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: COLOR1,
  },
  header: {
    backgroundColor: COLOR1,
    shadowColor: BLACK,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLOR2,
    marginBottom: 10,
  },
});

const { height } = Dimensions.get('window');

const paddingFromTop = 40;
const bottom = 0;
const middle = 160;

const content = ({ children, height, contentRef }) => (
  <View ref={contentRef} style={[styles.panel, { height }]}>
    {children}
  </View>
);

const renderHeader = () => (
  <View style={styles.header}>
    <View style={styles.panelHeader}>
      <View style={styles.panelHandle} />
    </View>
  </View>
);

const MapPanel = ({ panelRef, snapPoints, initialSnap, renderContent }) => (
  <BottomSheet
    ref={panelRef}
    snapPoints={snapPoints}
    renderContent={renderContent}
    renderHeader={renderHeader}
    initialSnap={initialSnap}
  />
);

export default compose(
  withProps(({ viewArea }) => ({
    panelRef: React.createRef(),
    contentRef: React.createRef(),
    initialSnap: 2,
    barsHeight: viewArea > 0 ? height - viewArea : 106
  })),
  withProps(({ barsHeight }) => {
    const draftTop = Number(((height - barsHeight - paddingFromTop) || 0).toFixed());
    const top = draftTop > 100 ? draftTop : 400;
    const draftMinContent = Number(((height - barsHeight - paddingFromTop - 38) || 0).toFixed());
    const minContent = draftMinContent > 0 ? draftMinContent : 300;
    return {
      top,
      minContent
    };
  }),
  withProps(({ contentHeight, top, minContent }) => ({
    snapPoints: [top, middle, bottom],
    contentHeight: contentHeight && contentHeight > minContent ? contentHeight : minContent,
  })),
  withHandlers({
    showPanel: ({ panelRef }) => (index) => {
      const { current } = panelRef;
      if (current) {
        current.snapTo(index);
      }
    },
    hidePanel: ({ panelRef }) => () => {
      const { current } = panelRef;
      if (current) {
        current.snapTo(2);
      }
    },
  }),
  withHandlers({
    renderContent: ({ children, contentHeight, contentRef }) => () => {
      return content({ children, height: contentHeight, contentRef });
    },
    showFullPanel: ({ showPanel }) => () => {
      showPanel(0);
    },
    showMiddlePanel: ({ showPanel }) => () => {
      showPanel(1);
    },
    crutch: ({ hidePanel, contentRef, top }) => () => {
      if (!contentRef || !contentRef.current) { return null; }
      contentRef.current.measure((width, height, px, py, fx, fy) => {
        if (fy < top) {
          return hidePanel();
        }
        return null;
      });
      return null;
    },
  }),
  lifecycle({
    componentDidMount() {
      if (Platform.OS === 'android') {
        // SUPERMEGA CRUTCH for Android
        const timerId = setInterval(this.props.crutch, 300);
        setTimeout(() => {
          clearInterval(timerId);
        }, 2000);
      }
    },
    componentDidUpdate(prevProps) {
      const { position } = this.props;
      const { position: oldPosition } = prevProps;
      if (position === 'top' && oldPosition !== 'top') {
        this.props.showFullPanel();
      } else if (position === 'middle' && oldPosition !== 'middle') {
        this.props.showMiddlePanel();
      } else if (position === 'bottom' && oldPosition !== 'bottom') {
        this.props.hidePanel();
      }
    }
  }),
  pure
)(MapPanel);
