import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  pick,
  map,
  filter,
  not,
  isEmpty,
  isNil,
  range,
  groupBy,
  find,
  propEq,
  sortBy,
  prop,
  path,
  values,
  pickAll,
  mapObjIndexed
} from 'ramda';
import { WHITE, BLACK, GREEN, RED } from '../../Colors/Colors';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row'
  },
  rootContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20
  },
  headerText: {
    fontSize: 11,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
    minWidth: 45,
  },
  workTimeTableContainer: {
    flexDirection: 'column',
    minWidth: 45,
    paddingTop: 5,
    paddingBottom: 5
  },
  workTimeTableContainerEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  workTimeTableText: {
    fontSize: 11,
    textAlign: 'center'
  },
  workTimeTableTextEmpty: {
    minWidth: 45
  }
});

const pickOnlyGoodTimeTables = timeTables => pick(range(1, 8), filter(f => not(isNil(f) || isEmpty(f)), timeTables));
const pickTimeTableByPriority = priority => map(i => (i[priority] ? i[priority] : []));
const addNul = t => (t < 10 ? `0${t}` : t);
const getTimeTableByPriorityAndSorted = (tableGroupedByPriority, priority) => map(sortBy(prop('start')))(map(map(i => ({
  start: `${addNul(i.beginHours)}:${addNul(i.beginMinutes)}`,
  end: `${addNul(i.endHours)}:${addNul(i.endMinutes)}`,
})))(pickOnlyGoodTimeTables(pickTimeTableByPriority(priority)(tableGroupedByPriority))));

const HeaderComponent = ({ dayNow, colors }) => {
  const daysArray = [
    { id: 1, title: 'Пн' },
    { id: 2, title: 'Вт' },
    { id: 3, title: 'Ср' },
    { id: 4, title: 'Чт' },
    { id: 5, title: 'Пт' },
    { id: 6, title: 'Сб' },
    { id: 7, title: 'Вс' },
  ];
  return (
    <View style={styles.flexRow}>
      {map((i) => {
        const isNow = +i.id === dayNow;
        const textStyle = {
          color: isNow ? WHITE : BLACK,
        };
        const containerStyle = {
          backgroundColor: isNow ? colors[i.id] : ''
        };
        return (
          <View key={i.id} style={containerStyle}>
            <Text style={[styles.headerText, textStyle]}>{i.title}</Text>
          </View>
        );
      }, daysArray)}
    </View>);
};

const WorkTimeTableComponent = ({ content, dayNow, colors }) => {
  const newContent = values(content);
  return (
    <View style={styles.flexRow}>
      {map((i) => {
        const isNow = +i.id === dayNow;
        const containerStyle = {
          backgroundColor: isNow ? colors[i.id] : ''
        };
        const textStyle = {
          color: isNow ? WHITE : BLACK
        };
        if (i.data) {
          return map(j => (
            <View key={i.id} style={[styles.workTimeTableContainer, containerStyle]}>
              <Text style={[styles.workTimeTableText, textStyle]}>{j.start}</Text>
              <Text style={[styles.workTimeTableText, textStyle]}>{j.end}</Text>
            </View>
          ), i.data);
        }
        return (
          <View
            key={i.id}
            style={[styles.workTimeTableContainer, styles.workTimeTableContainerEmpty, containerStyle]}
          >
            <Text style={[styles.workTimeTableText, styles.workTimeTableTextEmpty, textStyle]}>__</Text>
            <Text />
          </View>
        );
      }, newContent)}
    </View>
  );
};

const BreakComponent = ({ dayNow, colors }) => {
  const array = [
    { id: 1, value: '-' },
    { id: 2, value: '-' },
    { id: 3, value: '-' },
    { id: 4, value: '-' },
    { id: 5, value: '-' },
    { id: 6, value: '-' },
    { id: 7, value: '-' },
  ];
  return (
    <View style={styles.flexRow}>
      {map((i) => {
        const isNow = +i.id === dayNow;
        const textStyle = {
          color: isNow ? WHITE : BLACK,
        };
        const containerStyle = {
          backgroundColor: isNow ? colors[i.id] : ''
        };
        return (
          <View key={i.id} style={containerStyle}>
            <Text style={[styles.headerText, textStyle]}>{isNow ? 'Обед' : '-'}</Text>
          </View>
        );
      }, array)}
    </View>
  );
};

const BreakTimeTableComponent = ({ content, dayNow, colors }) => {
  const newContent = values(content);
  return (
    <View style={styles.flexRow}>
      {map((i) => {
        const isNow = +i.id === dayNow;
        const containerStyle = {
          backgroundColor: isNow ? colors[i.id] : ''
        };
        const textStyle = {
          color: isNow ? WHITE : BLACK
        };
        if (i.data) {
          return map(j => (
            <View key={i.id} style={[styles.workTimeTableContainer, containerStyle]}>
              <Text style={[styles.workTimeTableText, textStyle]}>{j.start}</Text>
              <Text style={[styles.workTimeTableText, textStyle]}>{j.end}</Text>
            </View>
          ), i.data);
        }
        return (
          <View key={i.id} style={[styles.workTimeTableContainer, styles.workTimeTableTextEmpty, containerStyle]}>
            <Text style={[styles.workTimeTableText, styles.workTimeTableTextEmpty, textStyle]}>__</Text>
            <Text />
          </View>
        );
      }, newContent)}
    </View>
  );
};

class MyTimeTableComponent extends React.PureComponent {
  render() {
    const timeTableTypes = this.props.timetableTypes;
    const timeTables = this.props.timetable || {};
    const tableGroupedByPriority = map(groupBy((g) => {
      return path(['priority'], find(propEq('id', g.timeTableTypeId))(timeTableTypes));
    }))(pickOnlyGoodTimeTables(timeTables));
    const resultWithPriorityOne = getTimeTableByPriorityAndSorted(tableGroupedByPriority, 1);
    const resultWithPriorityTwo = getTimeTableByPriorityAndSorted(tableGroupedByPriority, 2);
    const colorsArr = map(i => (i ? GREEN : RED), pickAll(['1', '2', '3', '4', '5', '6', '7'], resultWithPriorityOne));
    return (
      <View style={styles.rootContainer}>
        <HeaderComponent dayNow={this.props.dayNow} colors={colorsArr}/>
        <WorkTimeTableComponent
          content={
            mapObjIndexed((v, k) => (
              { id: k, data: v }))(pickAll(['1', '2', '3', '4', '5', '6', '7'], resultWithPriorityOne))
          }
          dayNow={this.props.dayNow}
          colors={colorsArr}
        />
        {isEmpty(resultWithPriorityTwo) ? null : <BreakComponent dayNow={this.props.dayNow} colors={colorsArr}/>}
        {isEmpty(resultWithPriorityTwo) ? null
          : <BreakTimeTableComponent
            content={
              mapObjIndexed((v, k) => (
                { id: k, data: v }))(pickAll(['1', '2', '3', '4', '5', '6', '7'], resultWithPriorityTwo))
            }
            dayNow={this.props.dayNow}
            colors={colorsArr}
          />
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  allSpots: path(['spotsReducer', 'initialSpots'], state),
  selectedSpotId: path(['selectedSpotReducer', 'selectedSpot', 'id'], state),
  timetableTypes: path(['timetableTypesReducer', 'timetableTypes'], state)
});

export default compose(
  connect(mapStateToProps),
  withNavigation,
  withProps(({ allSpots, selectedSpotId }) => ({
    timetable: prop('timeTable')(find(propEq('id', selectedSpotId))(allSpots)),
    dayNow: moment().isoWeekday()
  })),
)(MyTimeTableComponent);
