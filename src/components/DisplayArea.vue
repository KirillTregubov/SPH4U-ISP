<template>
  <div id="main">
    <div id="origin" class="area">
      <drag
        class="drag"
        :transfer-data="{ name: 'battery', origin: 'origin', data: '' }"
        :image-x-offset="117.5"
        :image-y-offset="90"
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
        :image-x-offset="117.5"
        :image-y-offset="90"
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
        :image-x-offset="117.5"
        :image-y-offset="90"
      >
        <Icon name="buzzer"/>
        <h4>Buzzer</h4>
        <div slot="image" class="drag-image">
          <Icon name="buzzer"/>
        </div>
      </drag>
      <drag
        class="drag"
        :transfer-data="{ name: 'resistor', origin: 'origin', data: '' }"
        :image-x-offset="117.5"
        :image-y-offset="90"
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
        :image-x-offset="117.5"
        :image-y-offset="90"
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
        :image-x-offset="117.5"
        :image-y-offset="90"
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
        :image-x-offset="117.5"
        :image-y-offset="90"
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
        :image-x-offset="117.5"
        :image-y-offset="90"
      >
        <Icon name="ammeter"/>
        <h4>Ammeter</h4>
        <div slot="image" class="drag-image">
          <Icon name="ammeter"/>
        </div>
      </drag>
      <drop id="trash" @drop="handleTrash">
        <Icon name="garbage"/>
      </drop>
    </div>
    <div id="display" ref="container" class="area">
      <drop id="drop" class="drop" @drop="handleDrop">
        <span class="connector">
          <!-- <div class="connector" :key="connector.id" v-for="connector in connectors" :style="{left: connector.x + 'px', top: connector.y + 'px', width: connector.width + 'px', height: connector.height + 'px'}" > -->
          <!-- <svg :style="{left: connector.x + 'px', top: connector.y + 'px'}"> -->
          <svg :key="connector.id" v-for="connector in connectors">
            <path
              id="curve"
              :d="connector.style"
              stroke="green"
              stroke-width="4"
              stroke-linecap="round"
              fill="transparent"
            ></path>
          </svg>
          <!-- <div class="sideline start"></div>
        <div class="centerline">
          <div class="centerlinetop"></div>
          <div class="centerlinebottom"></div>
        </div>
          <div class="sideline end"></div>-->
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
          <!-- <Icon :name="component.name" /> -->
          <drag
            class="drag"
            :transfer-data="{ name: component.name, origin: 'display', id: component.id }"
            :image-x-offset="84.5"
            :image-y-offset="92.5"
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
import { Drag, Drop } from 'vue-drag-drop'
import Icon from '@/components/CircuitIcon.vue'
import IconSmall from '@/components/Icon.vue'
let uuid = 0

export default {
  name: 'display-area',
  data: function () {
    return {
      components: [],
      connectors: [],
      currentOutput: 'Your latest action will be described here.',
      selected: '',
      isRemoving: false,
      sideSelected: '',
      valueSelected: '',
      visibleSelectors: ''
    }
  },
  methods: {
    handleDrop (data, event) {
      let x =
        Math.round(
          (event.pageX - this.$refs.container.getBoundingClientRect().left) / 10
        ) * 10
      let y =
        Math.round(
          (event.pageY - this.$refs.container.getBoundingClientRect().top) / 10
        ) * 10
      let verb = 'place'
      if (data.origin === 'display') verb = 'move'

      // snap extremes
      if (x < 50) x = 50
      if (y < 40) y = 40
      if (x > 950) x = 950
      if (y > 560) y = 560

      // check for overlap
      let overlap = false
      for (let i = 0; i < this.components.length; i++) {
        let component = this.components[i]
        if (
          component.id !== data.id &&
          Math.abs(x - component.x) < 100 &&
          Math.abs(y - component.y) < 60
        ) { overlap = true }
      }

      // add component
      if (overlap) {
        this.currentOutput =
          'Unable to ' +
          verb +
          ' the ' +
          data.name +
          ' as it overlapped with another component.'
      } else {
        let id = uuid, leftConnection = '', rightConnection = ''
        if (data.origin === 'display') {
          let i = this.components
            .map(component => component.id)
            .indexOf(data.id) // find index of your object
          this.components.splice(i, 1) // remove it from array
          id = data.id
          leftConnection = data.leftConnection
          rightConnection = data.rightConnection
        } else {
          uuid++
        }

        this.components.push({
          id: id,
          name: data.name,
          x: x - 37.5,
          y: y - 37.5,
          leftConnection: leftConnection,
          rightConnection: rightConnection
        })
        if (data.origin === 'display') {
          // update connectors
          this.updateConnectors()
        }

        this.currentOutput =
          'The ' + data.name + ' was ' + verb + 'd successfully.'
      }
    },
    handleTrash (data, event) {
      if (data.origin === 'origin') {
        this.currentOutput =
          'Unable to delete the ' + data.name + ' as it was never placed.'
      } else {
        let i = this.components.map(component => component.id).indexOf(data.id) // find index of your object
        this.components.splice(i, 1) // remove it from array
        this.currentOutput = 'The ' + data.name + ' was deleted successfully.'
      }
    },
    showSelectors (id, isLeaving) {
      if (!isLeaving) {
        this.visibleSelectors = id
      } else {
        this.visibleSelectors = ''
      }
    },
    select (id, side, value) {
      /* remove
      if (this.isRemoving) {
        let removedStart = false
        let removedAt
        let startConnectors = this.connectors.filter(
            elem => (elem.start === this.selected && elem.end === id)
          )
        console.log(startConnectors)
        for (let i = 0; i < startConnectors.length; i++) {
          if (this.components.find(component => component.id === startConnectors[i].end).leftConnection === this.selected && side === 'left') {
            this.components.find(component => component.id === startConnectors[i].end).leftConnection = ''
            removedStart = true
            removedAt = i
          } else if (this.components.find(component => component.id === startConnectors[i].end).rightConnection === this.selected && side === 'right') {
            this.components.find(component => component.id === startConnectors[i].end).rightConnection = ''
            removedStart = true
            removedAt = i
            console.log(i)
          }
        }
        if (removedStart) {
          console.log('start')
          this.connectors.splice(this.connectors.indexOf(startConnectors[removedAt])-1, 1)
        }

        let removedEnd = false
        removedAt = ''
        let endConnectors = this.connectors.filter(
            elem => (elem.start === id && elem.end === this.selected)
          )
        for (let i = 0; i < endConnectors.length; i++) {
           if (this.components.find(component => component.id === endConnectors[i].start).leftConnection === this.selected && side === 'left') {
            this.components.find(component => component.id === endConnectors[i].start).leftConnection = ''
            removedEnd = true
            removedAt = i
          } else if (this.components.find(component => component.id === endConnectors[i].start).rightConnection === this.selected && side === 'right') {
            this.components.find(component => component.id === endConnectors[i].start).rightConnection = ''
            removedEnd = true
            removedAt = i
          }
        }
        if (removedEnd) {
          console.log('end')
          this.connectors.splice(this.connectors.indexOf(endConnectors[removedAt])-1, 1)
        }

        if (removedStart && removedEnd) console.log('error???')
        if (removedStart || removedEnd) {
          if (this.sideSelected === 'left') {
            this.components.find(component => component.id === this.selected).leftConnection = ''
          } else {
            this.components.find(component => component.id === this.selected).rightConnection = ''
          }
          this.currentOutput = 'Removed the connection successfully.'
        } else {
          this.currentOutput = 'Unable to remove this connnection.'
        }
        this.isRemoving = false
        this.selected = ''
        this.sideSelected = ''
      }
      // check if need to remove
      else if (!this.isRemoving && ((this.components.find(component => component.id === id).leftConnection !== '' && side === 'left') || (this.components.find(component => component.id === id).rightConnection !== '' && side === 'right'))) {
        this.selected = id
        this.sideSelected = side
        this.isRemoving = true
      } else*/ if (this.selected === '') {
        this.selected = id
        this.sideSelected = side
        this.valueSelected = value
      } else if (this.selected === id && this.sideSelected === side) {
        this.selected = ''
        this.sideSelected = ''
        this.valueSelected = ''
      } else if (this.selected === id) {
        this.currentOutput =
          'Cannot connect ' +
          this.components.find(component => component.id === this.selected)
            .name +
          ' with itself.'
        this.selected = ''
        this.valueSelected = ''
      } else if (this.components.find(component => component.id === id).leftConnection !== '' && this.components.find(component => component.id === id).rightConnection !== '') {
        this.currentOutput = 'Cannot select this component as it is connected on both sides.'
        this.selected = ''
        this.valueSelected = ''
      /*} else if (
        this.connectors.filter(
          elem =>
            (elem.start === this.selected && elem.end === id) ||
            (elem.start === id && elem.end === this.selected)
        ).length > 1
      ) {
        this.currentOutput =
          'The ' +
          this.components.find(component => component.id === this.selected)
            .name +
          ' and ' +
          this.components.find(component => component.id === id).name +
          ' are already connected in a loop.'
        this.selected = ''
        this.valueSelected = ''*/
      } else if (
        (value === '+' || value === '-') &&
        value === this.valueSelected
      ) {
        this.currentOutput = 'Cannot connect two of the same sides.'
        this.selected = ''
        this.valueSelected = ''
        // } else if (this.components[id].name === 'battery' && this.components[id].name === this.components[this.selected].name) {
        //   this.currentOutput = 'Cannot connect two batteries together.'
        //   this.selected = ''
        //   this.valueSelected = ''
      } else {
        this.connectors.push({
          number:
            this.connectors.filter(
              elem =>
                (elem.start === this.selected && elem.end === id) ||
                (elem.start === id && elem.end === this.selected)
            ).length + 1,
          start: this.selected,
          end: id,
          x: '',
          y: '',
          width: '',
          height: '',
          style: ''
        })
        this.currentOutput =
          'A connection between ' +
          this.components.find(component => component.id === this.selected)
            .name +
          ' and ' +
          this.components.find(component => component.id === id).name +
          ' was created successfully.'
        this.selected = ''
        this.sideSelected = ''
        this.valueSelected = ''

        // update connectors
        this.updateConnectors()
      }
    },
    updateConnectors () {
      for (let i = 0; i < this.connectors.length; i++) {
        let connector = this.connectors[i]
        let startObj = this.components.find(
          component => component.id === connector.start
        )
        let endObj = this.components.find(
          component => component.id === connector.end
        )

        let p1x, p1y, p2x, p2y
        
        // start component
        if (startObj.leftConnection === '' || connector.number === 2) {
          p1x = startObj.x + 15
          connector.x = p1x
          p1y = startObj.y + 37.5
          connector.y = p1x
          startObj.leftConnection = endObj.id
        } else {
          p1x = startObj.x + 90
          connector.x = p1x
          p1y = startObj.y + 37.5
          connector.y = p1x
          startObj.rightConnection = endObj.id
        }

        // end component
        if (endObj.leftConnection === '' || connector.number === 2) {
          p2x = endObj.x + 15
          p2y = endObj.y + 37.5
          endObj.leftConnection = startObj.id
        } else {
          p2x = endObj.x + 90
          p2y = endObj.y + 37.5
          endObj.rightConnection = startObj.id
        }

        let mpx = (p2x + p1x) * 0.5
        let mpy = (p2y + p1y) * 0.5

        let theta = Math.atan2(p2y - p1y, p2x - p1x) - Math.PI / 2
        let offset = -30

        let c1x = mpx + offset * Math.cos(theta)
        let c1y = mpy + offset * Math.sin(theta)

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
          p2y
        // this.connectors[i] = connector;
      }
    }
    /*
    updateConnectors () {
      for (let i = 0; i < this.connectors.length; i++) {
        let connector = this.connectors[i]
        let startObj = this.components.find(component => component.id === connector.start)
        let endObj = this.components.find(component => component.id === connector.end)

        // beside
        if (startObj.y === endObj.y) {
          console.log('beside')
        }
        // above or below
        else {
          console.log('above or below')

          // determine orientation
          let leftObj = startObj.x < endObj.x ? startObj : endObj
          let rightObj = startObj === leftObj ? endObj : startObj

          if (connector.number === 1) {
            // left

          } else {
            // right
          }
        }

        if (Math.abs(startObj.x - endObj.x) > 100) {
          // x
          connector.x = (startObj.x < endObj.x ? startObj.x : endObj.x) + 37.5
          // y
          connector.y = (startObj.y < endObj.y ? startObj.y : endObj.y) - 2.5
          // height
          connector.height = Math.abs(startObj.y - endObj.y) + 5
          // width
          connector.width = Math.abs(startObj.x - endObj.x) - 75
        } else {

        }
        // console.log(this.connectors.filter(elem => (elem.start === connector.start && elem.end === connector.end) || (elem.start === connector.end && elem.end === connector.start)))

        this.currentOutput = 'The ' + startObj.name + ' and ' + endObj.name + ' were connected successfully.'
      }

      // drawConnector() {

      //   const getCenterStyle = (v, h) => {
      //     return {
      //       height: (height / 2) - borderWidth,
      //       width: `${widthAndMargin}px`,
      //       [`margin${h}`]: `${widthAndMargin}px`,
      //       [`border${v}${h}Width`]: borderWidth,
      //       [`border${h}Width`]: borderWidth,
      //       [`border${v}Width`]: v === 'Top'
      //         ? Math.min(borderWidth, borderRadius)
      //         : borderWidth,
      //       [`border${v}${h}Radius`]: `${borderRadius}px${shouldSmooth ? ' ' + (borderRadius / 2) + 'px' : ''}`
      //     };
      //   };

      //   this.setState({
      //     top,
      //     height,
      //     left,
      //     width,
      //     startLineStyle: { alignSelf: `flex-${leftIsHigher ? 'start' : 'end'}` },
      //     centerLineTopStyle: getCenterStyle('Top', leftIsHigher ? 'Right' : 'Left'),
      //     centerLineBottomStyle: getCenterStyle('Bottom', leftIsHigher ? 'Left' : 'Right'),
      //     endLineStyle: { alignSelf: `flex-${leftIsHigher ? 'end' : 'start'}` }
      //   });
      // }
    } */
  },
  components: {
    Icon,
    IconSmall,
    Drag,
    Drop
  }
}
</script>

<style lang="scss" scoped>
.component {
  position: absolute;

  &.visibleSelectors {
    .displayContainer {
      padding: 0 0;
      .sideIcon {
        display: block !important;
      }
    }
  }
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
  svg {
    margin: 0 15px;
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
