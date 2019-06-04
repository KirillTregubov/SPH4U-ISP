<template>
  <div id="main">
    <div id="origin" class="area">
      <drag
        class="drag"
        :transfer-data="{ name: 'battery', origin: 'origin', data: '' }"
        :image-x-offset="imageOffsetX"
        :image-y-offset="imageOffsetY"
      >
        <Icon name="battery"/>
        <h4>Battery</h4>
        <div slot="image" class="drag-image">
          <Icon name="battery"/>
        </div>
      </drag>
      <drag
        class="drag"
        :transfer-data="{ name: 'light', origin: 'origin', data: '' }"
        :image-x-offset="imageOffsetX"
        :image-y-offset="imageOffsetY"
      >
        <Icon name="light"/>
        <h4>Light</h4>
        <div slot="image" class="drag-image">
          <Icon name="light"/>
        </div>
      </drag>
      <drag
        class="drag"
        :transfer-data="{ name: 'buzzer', origin: 'origin', data: '' }"
        :image-x-offset="imageOffsetX"
        :image-y-offset="imageOffsetY"
      >
        <Icon name="buzzer"/>
        <h4>Buzzer</h4>
        <div slot="image" class="drag-image">
          <Icon name="buzzer"/>
        </div>
      </drag>
      <!-- <drag
        class="drag"
        :transfer-data="{ name: 'resistor', origin: 'origin', data: '' }"
        :image-x-offset="imageOffsetX"
        :image-y-offset="imageOffsetY"
      >
        <Icon name="resistor"/>
        <h4>Resistor</h4>
        <div slot="image" class="drag-image">
          <Icon name="resistor"/>
        </div>
      </drag>
      <drag
        class="drag"
        :transfer-data="{ name: 'switchOpen', origin: 'origin', data: '' }"
        :image-x-offset="imageOffsetX"
        :image-y-offset="imageOffsetY"
      >
        <Icon name="switchOpen"/>
        <h4>Open Switch</h4>
        <div slot="image" class="drag-image">
          <Icon name="switchOpen"/>
        </div>
      </drag>
      <drag
        class="drag"
        :transfer-data="{ name: 'switchClosed', origin: 'origin', data: '' }"
        :image-x-offset="imageOffsetX"
        :image-y-offset="imageOffsetY"
      >
        <Icon name="switchClosed"/>
        <h4>Closed Switch</h4>
        <div slot="image" class="drag-image">
          <Icon name="switchClosed"/>
        </div>
      </drag>
      <drag
        class="drag"
        :transfer-data="{ name: 'voltmeter', origin: 'origin', data: '' }"
        :image-x-offset="imageOffsetX"
        :image-y-offset="imageOffsetY"
      >
        <Icon name="voltmeter"/>
        <h4>Voltmeter</h4>
        <div slot="image" class="drag-image">
          <Icon name="voltmeter"/>
        </div>
      </drag>
      <drag
        class="drag"
        :transfer-data="{ name: 'ammeter', origin: 'origin', data: '' }"
        :image-x-offset="imageOffsetX"
        :image-y-offset="imageOffsetY"
      >
        <Icon name="ammeter"/>
        <h4>Ammeter</h4>
        <div slot="image" class="drag-image">
          <Icon name="ammeter"/>
        </div>
      </drag> -->
      <drop id="trash" @drop="handleTrash">
        <Icon name="garbage"/>
      </drop>
    </div>
    <div id="display" ref="container" class="area">
      <drop id="drop" class="drop" @drop="handleDrop">
        <span class="connector">
          <svg :key="connector.id" v-for="connector in connectors">
            <path
              :d="connector.style"
              stroke="white"
              stroke-width="3.8"
              stroke-linecap="round"
              fill="transparent"
            ></path>
          </svg>
        </span>
        <div
          class="component"
          :class="{visibleSelectors: visibleSelectors === component.id, selected: selected === component.id, left: sideSelected === 'left', right: sideSelected === 'right'}"
          @mouseenter="showSelectors(component.id, false)"
          @mouseleave="showSelectors(component.id, true)"
          :style=" {left: component.x + 'px', top: component.y + 'px'}"
          :key="component.id"
          v-for="component in components"
        >
          <div class="stats" v-if="component.physics.v !== null && component.physics.i !== null && component.physics.r !== null">
            V: {{ component.physics.v }}V
            <br>
            I: {{component.physics.i }}A
            <br>
            R: {{component.physics.r }}Ω
          </div>
          <!-- <Icon :name="component.name" /> -->
          <drag
            class="drag"
            :transfer-data="{ name: component.name, origin: 'display', id: component.id }"
            :image-x-offset="imageOffsetX - 15"
            :image-y-offset="imageOffsetY"
          >
            <div class="displayContainer" v-if="component.name === 'battery'">
              <div
                class="sideIcon left"
                @click="select(component.id, 'left', '+')"
                :class="{selected: selected === component.id && sideSelected === 'left'}"
              >
                <IconSmall name="add"/>
              </div>
              <Icon :name="component.name"/>
              <div
                class="sideIcon right"
                @click="select(component.id, 'right', '-')"
                :class="{selected: selected === component.id && sideSelected === 'right'}"
              >
                <IconSmall name="remove"/>
              </div>
            </div>
            <div class="displayContainer" v-else>
              <div
                class="sideIcon left"
                @click="select(component.id,'left')"
                :class="{selected: selected === component.id && sideSelected === 'left'}"
              >
                <IconSmall/>
              </div>
              <Icon :name="component.name"/>
              <div
                class="sideIcon right"
                @click="select(component.id,'right')"
                :class="{selected: selected === component.id && sideSelected === 'right'}"
              >
                <IconSmall/>
              </div>
            </div>
            <div slot="image" class="drag-image">
              <Icon :name="component.name"/>
            </div>
          </drag>
        </div>
      </drop>
    </div>
    <div id="output" class="area">
      <h3>> {{ currentOutput }}</h3>
    </div>
  </div>
</template>

<script>
import { Drag, Drop } from 'vue-drag-drop';
import Icon from '@/components/CircuitIcon.vue';
import IconSmall from '@/components/Icon.vue';
let uuid = 0;

export default {
  name: 'display-area',
  data: function() {
    return {
      imageOffsetX: 50,
      imageOffsetY: 35,
      components: [],
      connectors: [],
      currentOutput: 'Your latest action will be described here.',
      selected: '',
      sideSelected: '',
      valueSelected: '',
      visibleSelectors: ''
    };
  },
  methods: {
    updatePhysics() {
      // start at battery
      var batteries = this.components.filter(
        component => component.name === 'battery'
      );

      if (batteries.length > 0) {
        var primaryBattery;
        for (let i = 0; i < batteries.length; i++) {
          if (
            batteries[i].connections.left.length > 0 &&
            batteries[i].connections.right.length > 0
          ) {
            primaryBattery = batteries[i];

            var pathSteps = [];
            pathSteps.push([{ side: 1, physics: { v: 10, i: null, r: null}, origin: primaryBattery.id, dest: primaryBattery.connections.left}]);
            // pathSteps.push({ num: null, arr: primaryBattery.connections.left});

            var finished = false
            while (!finished) {
              var newArray = [];
              for (let j = 0; j < pathSteps[pathSteps.length-1].length; j++) {
                if (pathSteps[pathSteps.length-1][j].finished) {
                  if (pathSteps[pathSteps.length-1].length == 1) finished = true
                }
                else {
                  var connectors = this.connectors.filter(
                    elem =>
                      (pathSteps[pathSteps.length-1][j].origin === elem.start && elem.startNumber === pathSteps[pathSteps.length-1][j].side && pathSteps[pathSteps.length-1][j].dest.includes(elem.end)) ||
                      (pathSteps[pathSteps.length-1][j].origin === elem.end && elem.endNumber === pathSteps[pathSteps.length-1][j].side && pathSteps[pathSteps.length-1][j].dest.includes(elem.start))
                  );
                  // console.log(connectors);

                  for (let k = 0; k < connectors.length; k++) {
                    if (pathSteps[pathSteps.length-1][j].origin === connectors[k].start) {
                      var found = false;
                      for(var l = 0; l < newArray.length; l++) {
                          if (newArray[l].origin === connectors[k].end) {
                              found = true;
                              break;
                          }
                      }
                      if (!found) {
                        if ((connectors[k].end === primaryBattery.id && connectors[k].endNumber === 2)) newArray.push({finished: true})
                        else {
                          // console.log('start')
                          if (connectors[k].endNumber === 1) {
                            var physics =  { v: null, i: null, r: 10}
                            // if (this.components[connectors[k].end].name === 'battery') physics = { v: 10, i: null, r: null}
                            // else physics =  { v: null, i: null, r: 10}
                            if (this.components[connectors[k].end].connections.right.length === 0) newArray.push({finished: true})
                            else newArray.push({ side: 2, physics: physics, origin: connectors[k].end, dest: this.components[connectors[k].end].connections.right })
                          } else {
                            if (this.components[connectors[k].end].connections.left.length === 0) newArray.push({finished: true})
                            else newArray.push({ side: 1, physics: physics, origin: connectors[k].end, dest: this.components[connectors[k].end].connections.left })
                          }
                        }
                      }
                    } else {
                      var found = false;
                      for(var l = 0; l < newArray.length; l++) {
                          if (newArray[l].origin === connectors[k].start) {
                              found = true;
                              break;
                          }
                      }
                      if (!found) {
                        if (connectors[k].start === primaryBattery.id && connectors[k].startNumber === 2) newArray.push({finished: true})
                        else {
                          // console.log('end')
                          if (connectors[k].startNumber === 1) {
                            var physics =  { v: null, i: null, r: 10}
                            // if (this.components[connectors[k].start].name === 'battery') physics = { v: 10, i: null, r: null}
                            // else physics =  { v: null, i: null, r: 10}
                            if (this.components[connectors[k].start].connections.right.length === 0) newArray.push({finished: true})
                            else newArray.push({ side: 2, physics: physics, origin: connectors[k].start, dest: this.components[connectors[k].start].connections.right })
                          } else {
                            if (this.components[connectors[k].start].connections.left.length === 0) newArray.push({finished: true})
                            else newArray.push({ side: 1, physics: physics, origin: connectors[k].start, dest: this.components[connectors[k].start].connections.left })
                          }
                        }
                      }
                    }
                  }
                } 
              }
              if (newArray.length === 0) {
                // console.log('TR')
                finished = true
              } else pathSteps.push(newArray);
              // console.log(pathSteps)
            }

            // resistance loop
            var totalR = 0;
            for (let i = pathSteps.length-1; i > 0; i--) {
              if (Object.keys(pathSteps[i][0]).length === 1) {
                // console.log('ignore')
              } else if (pathSteps[i].length > 1) {
                var parallelR = 0;
                for (let j = 0; j < pathSteps[i].length; j++) {
                  if (Object.keys(pathSteps[i][j]).length > 1)
                    parallelR += 1 / pathSteps[i][j].physics.r
                }
                totalR += 1/parallelR;
              } else {
                totalR += pathSteps[i][0].physics.r
              }
            }
            pathSteps[0][0].physics.r = totalR

            // Current & Voltage
            pathSteps[0][0].physics.i = pathSteps[0][0].physics.v / pathSteps[0][0].physics.r
            this.components.find(component => component.id === pathSteps[0][0].origin).physics = pathSteps[0][0].physics
            for (let i = 1; i < pathSteps.length; i++) {
              if (Object.keys(pathSteps[i][0]).length === 1) {
                // console.log('ignore')
              } else if (pathSteps[i].length > 1) {
                for (let j = 0; j < pathSteps[i].length; j++) {
                  if (Object.keys(pathSteps[i][j]).length > 1) {
                    pathSteps[i][j].physics.i = pathSteps[0][0].physics.i / pathSteps[i].length
                    pathSteps[i][j].physics.v = pathSteps[0][0].physics.v / (pathSteps.length-2)
                    this.components.find(component => component.id === pathSteps[i][j].origin).physics = pathSteps[i][j].physics
                  }
                    // specific parallel
                }
              } else {
                pathSteps[i][0].physics.i = pathSteps[0][0].physics.i
                pathSteps[i][0].physics.v = pathSteps[0][0].physics.v / (pathSteps.length-2)
                this.components.find(component => component.id === pathSteps[i][0].origin).physics = pathSteps[i][0].physics
              }
            }
          }
        }
      }
    },
    showSelectors(id, isLeaving) {
      if (!isLeaving) {
        this.visibleSelectors = id;
      } else {
        this.visibleSelectors = '';
      }
    },
    select(id, side, value) {
      if (this.selected === '') {
        this.selected = id;
        this.sideSelected = side;
        this.valueSelected = value;
      } else if (this.selected !== '' && this.hasConnection(id, side)) {
        this.currentOutput =
          'Removed connection between ' +
          this.components.find(component => component.id === this.selected)
            .name +
          ' and ' +
          this.components.find(component => component.id === id).name +
          '.';

        // remove connector
        var startNumber, endNumber;
        if (this.sideSelected === 'right') startNumber = 2;
        else startNumber = 1;
        if (side === 'right') endNumber = 2;
        else endNumber = 1;
        this.connectors.splice(
          this.connectors.indexOf(
            this.connectors.find(
              connector =>
                connector.start === this.selected &&
                connector.end === id &&
                connector.startNumber === startNumber &&
                connector.endNumber === endNumber
            )
          ),
          1
        );

        // remove connection in component
        var startConnection = this.components[this.selected].connections;
        var endConnection = this.components[id].connections;
        if (startNumber === 2) {
          startConnection.right.splice(startConnection.right.indexOf(id), 1);
        } else startConnection.left.splice(startConnection.left.indexOf(id), 1);
        if (endNumber === 2) {
          endConnection.right.splice(
            endConnection.right.indexOf(this.selected),
            1
          );
        } else {
          endConnection.left.splice(
            endConnection.left.indexOf(this.selected),
            1
          );
        }

        this.selected = '';
        this.sideSelected = '';
        this.valueSelected = '';
      } else if (this.selected === id && this.sideSelected === side) {
        this.selected = '';
        this.sideSelected = '';
        this.valueSelected = '';
      } else if (this.selected === id) {
        this.currentOutput =
          'Cannot connect ' +
          this.components.find(component => component.id === this.selected)
            .name +
          ' with itself.';
        this.selected = '';
        this.sideSelected = '';
        this.valueSelected = '';
      } else if (
        (value === '+' || value === '-') &&
        value === this.valueSelected
      ) {
        // fix this in builders
        this.currentOutput = 'Cannot connect two of the same sides.';
        this.selected = '';
        this.sideSelected = '';
        this.valueSelected = '';
      } else {
        let startLength, endLength;
        if (this.sideSelected === 'left') {
          this.components[this.selected].connections.left.push(id);
          startLength = 1;
        } else {
          this.components[this.selected].connections.right.push(id);
          startLength = 2;
        }

        if (side === 'left') {
          this.components[id].connections.left.push(this.selected);
          endLength = 1;
        } else {
          this.components[id].connections.right.push(this.selected);
          endLength = 2;
        }

        this.connectors.push({
          startNumber: startLength,
          endNumber: endLength,
          start: this.selected,
          end: id,
          x: '',
          y: '',
          style: ''
        });

        this.currentOutput =
          'A connection between ' +
          this.components.find(component => component.id === this.selected)
            .name +
          ' and ' +
          this.components.find(component => component.id === id).name +
          ' was created successfully.';
        this.selected = '';
        this.sideSelected = '';
        this.valueSelected = '';

        // update connectors
        this.updateConnectors();

        // update physics
        this.updatePhysics();
      }
    },
    handleDrop(data, event) {
      let x =
        Math.round(
          (event.pageX -
            this.$refs.container.getBoundingClientRect().left -
            this.getScrollOffsets().x -
            17.5) /
            10
        ) * 10;
      let y =
        Math.round(
          (event.pageY -
            this.$refs.container.getBoundingClientRect().top -
            this.getScrollOffsets().y) /
            10
        ) * 10;
      let verb = 'place';
      if (data.origin === 'display') verb = 'move';

      // snap extremes
      if (x < 50) x = 50;
      if (y < 40) y = 40;
      if (x > 950) x = 950;
      if (y > 560) y = 560;

      // check for overlap
      let overlap = false;
      for (let i = 0; i < this.components.length; i++) {
        let component = this.components[i];
        if (
          component.id !== data.id &&
          Math.abs(x - component.x) < 100 &&
          Math.abs(y - component.y) < 60
        ) {
          overlap = true;
        }
      }

      // add component
      if (overlap) {
        this.currentOutput =
          'Unable to ' +
          verb +
          ' the ' +
          data.name +
          ' as it overlapped with another component.';
      } else {
        let id = uuid;
        let connections = {
          left: [],
          right: []
        };
        let physics = {
          v: null,
          i: null,
          r: null
        };
        if (data.name === 'battery') physics.v = 10
        else physics.r = 10
        if (data.origin === 'display') {
          let i = this.components
            .map(component => component.id)
            .indexOf(data.id);
          connections = this.components[i].connections;
          physics = this.components[i].physics;
          this.components.splice(i, 1);
          id = data.id;
        } else {
          uuid++;
        }

        this.components.push({
          id: id,
          name: data.name,
          x: x - 37.5,
          y: y - 37.5,
          connections: connections,
          physics: physics
        });
        if (data.origin === 'display') {
          // update connectors
          this.updateConnectors();
        }

        this.currentOutput =
          'The ' + data.name + ' was ' + verb + 'd successfully.';
      }
    },
    handleTrash(data, event) {
      if (data.origin === 'origin') {
        this.currentOutput =
          'Unable to delete the ' + data.name + ' as it was never placed.';
      } else {
        let index = this.components
          .map(component => component.id)
          .indexOf(data.id); // find index of your object

        // delete left and right connectors
        var connectors = this.connectors.filter(
          connector => connector.start === index || connector.end === index
        );
        for (let i = 0; i < connectors.length; i++) {
          if (connectors[i].start === index) {
            // delete start connector references
            this.components[connectors[i].end].connections.left.splice(
              this.components[connectors[i].end].connections.left.indexOf(
                index
              ),
              1
            );
            this.components[connectors[i].end].connections.right.splice(
              this.components[connectors[i].end].connections.right.indexOf(
                index
              ),
              1
            );
            // delete start connector
            this.connectors.splice(this.connectors.indexOf(connectors[i]), 1);
          } else {
            // delete end connector references
            this.components[connectors[i].start].connections.left.splice(
              this.components[connectors[i].start].connections.left.indexOf(
                index
              ),
              1
            );
            this.components[connectors[i].start].connections.right.splice(
              this.components[connectors[i].start].connections.right.indexOf(
                index
              ),
              1
            );
            // delete end connector
            this.connectors.splice(this.connectors.indexOf(connectors[i]), 1);
          }
        }

        // delete component
        this.components.splice(index, 1); // remove it from array
        this.currentOutput = 'The ' + data.name + ' was deleted successfully.';
      }
    },
    updateConnectors() {
      for (let i = 0; i < this.connectors.length; i++) {
        let connector = this.connectors[i];
        let startObj = this.components.find(
          component => component.id === connector.start
        );
        let endObj = this.components.find(
          component => component.id === connector.end
        );

        let p1x, p1y, p2x, p2y;
        // start component
        if (connector.startNumber === 1) {
          p1x = startObj.x + 15;
          connector.x = p1x;
          p1y = startObj.y + 38;
          connector.y = p1x;
        } else if (connector.startNumber === 2) {
          p1x = startObj.x + 90;
          connector.x = p1x;
          p1y = startObj.y + 38;
          connector.y = p1x;
        } else {
          window.alert('ERROR');
        }

        // end component
        if (connector.endNumber === 1) {
          p2x = endObj.x + 15;
          p2y = endObj.y + 38;
        } else if (connector.endNumber === 2) {
          p2x = endObj.x + 90;
          p2y = endObj.y + 38;
        } else {
          window.alert('ERROR');
        }

        let mpx = (p2x + p1x) * 0.5;
        let mpy = (p2y + p1y) * 0.5;

        let theta = Math.atan2(p2y - p1y, p2x - p1x) - Math.PI / 2;
        let offset = -30;

        let c1x = mpx + offset * Math.cos(theta);
        let c1y = mpy + offset * Math.sin(theta);

        connector.style =
          'M' +
          p1x +
          ' ' +
          p1y +
          ' Q ' +
          c1x +
          ' ' +
          c1y +
          ' ' +
          p2x +
          ' ' +
          p2y;
      }
    },
    hasConnection(id, side) {
      var connectionAmount = this.connectors.filter(
        elem =>
          (elem.start === this.selected && elem.end === id) ||
          (elem.start === id && elem.end === this.selected)
      ).length;

      var startSideConnections, endSideConnections;
      if (this.sideSelected === 'right') {
        startSideConnections = this.components[this.selected].connections.right;
      } else {
        startSideConnections = this.components[this.selected].connections.left;
      }
      if (side === 'right') {
        endSideConnections = this.components[id].connections.right;
      } else endSideConnections = this.components[id].connections.left;

      if (
        connectionAmount > 0 &&
        startSideConnections.includes(id) &&
        endSideConnections.includes(this.selected)
      ) {
        return true;
      } else return false;
    },
    getScrollOffsets() {
      var doc = document;
      var w = window;
      var x, y, docEl;

      if (typeof w.pageYOffset === 'number') {
        x = w.pageXOffset;
        y = w.pageYOffset;
      } else {
        docEl =
          doc.compatMode && doc.compatMode === 'CSS1Compat'
            ? doc.documentElement
            : doc.body;
        x = docEl.scrollLeft;
        y = docEl.scrollTop;
      }
      return { x: x, y: y };
    }
  },
  components: {
    Icon,
    IconSmall,
    Drag,
    Drop
  }
};
</script>

<style lang="scss" scoped>
.component {
  position: absolute;

  &.visibleSelectors {
    .stats {
      display: block !important;
    }

    .displayContainer {
      padding: 0 0;

      .sideIcon {
        display: block !important;
      }
    }
  }
}

.stats {
  display: none;
  position: fixed;
  width: 105px;
  padding: 2px 0;
  margin: -20px 0 0 0;
  background-color: hsla(209, 23%, 60%, 0.8);
  color: var(--black);
  font-size: 0.8em;
  font-weight: 600;
  border-radius: 7px;
}

.selected {
  &.left {
    .displayContainer {
      padding-left: 0;
    }

    .sideIcon.left {
      display: block;
      background-color: var(--darkergrey);
      border-radius: 50%;
      padding: 2px;
      margin: -2px;
    }
  }

  &.right {
    .displayContainer {
      padding-right: 0;
    }

    .sideIcon.right {
      display: block;
      background-color: var(--darkergrey);
      border-radius: 50%;
      padding: 2px;
      margin: -2px;
    }
  }
}

.connector {
  height: 100%;
  width: 100%;
  position: relative;
  display: inline-block;

  svg {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
  }
}

// .connector {
//   background-color: red;
//   position: absolute;
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   .sideline {
//     border-top: 5px solid #ada;
//     width: 50%;
//     position: relative;
//     height: 0px;

//     &.start::before {
//       content: '';
//       position: absolute;
//       width: 10px;
//       height: 10px;
//       background-color: #ada;
//       left: -5px;
//       top: calc(50% - 8px);
//       border-radius: 7px;
//     }

//     &.end::before {
//       content: '';
//       position: absolute;
//       width: 10px;
//       height: 10px;
//       background-color: #ada;
//       right: -5px;
//       top: calc(50% - 8px);
//       border-radius: 7px;
//     }
//   }
// }

.drag,
.drop {
  display: inline-block;
}

.displayContainer {
  display: flex;
  align-items: center;
  padding: 0 25px;

  .circuitIcon {
    margin: 0 -10px;
  }

  .sideIcon {
    display: none;
    z-index: 1;
    width: 25px;
    height: 25px;

    // &.selected {
    //   display: block;
    //   background-color: var(--darkergrey);
    //   border-radius: 1px;
    // }
  }
}

.area {
  @include container(var(--black));
  margin: 0 auto;
  margin-bottom: 15px;
}

#origin {
  width: 450px;

  svg {
    margin: 0 18px;
  }
  h4 {
    margin: 0 0 15px 0;
    font-weight: normal;
  }
}

#trash {
  display: inline;
}

#drop {
  width: 100%;
  height: 100%;
  position: relative;
}

#display {
  width: 1000px;
  height: 600px;
  // padding-bottom: 4px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%23486581' fill-opacity='0.1'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E");
}

#output {
  min-height: 50px;
  text-align: left;

  h3 {
    font-size: 1.05em;
    padding-left: 20px;
  }
}

@media only screen and (max-width: 1019px) {
  #main {
    display: none;
  }
}

.drag,
.drag::after,
.drag::before {
  -webkit-user-select: element !important;
  -webkit-user-drag: element !important;
  -webkit-app-region: drag !important;
  cursor: default;
}
</style>
