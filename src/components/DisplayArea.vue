<template>
  <div id="main">
    <div id="origin" class="area">
      <drag class="drag" :transfer-data="{ name: 'battery', origin: 'origin', data: '' }" :image-x-offset="117.5" :image-y-offset="90">
        <Icon name="battery"></Icon>
        <h4>Battery</h4>
        <div slot="image" class="drag-image">
          <Icon name="battery"></Icon>
        </div>
      </drag>
      <drag class="drag" :transfer-data="{ name: 'light', origin: 'origin', data: '' }" :image-x-offset="117.5" :image-y-offset="90">
        <Icon name="light"></Icon>
        <h4>Light</h4>
        <div slot="image" class="drag-image">
          <Icon name="light"></Icon>
        </div>
      </drag>
      <drag class="drag" :transfer-data="{ name: 'buzzer', origin: 'origin', data: '' }" :image-x-offset="117.5" :image-y-offset="90">
        <Icon name="buzzer"></Icon>
        <h4>Buzzer</h4>
        <div slot="image" class="drag-image">
          <Icon name="buzzer"></Icon>
        </div>
      </drag>
      <drag class="drag" :transfer-data="{ name: 'resistor', origin: 'origin', data: '' }" :image-x-offset="117.5" :image-y-offset="90">
        <Icon name="resistor"></Icon>
        <h4>Resistor</h4>
        <div slot="image" class="drag-image">
          <Icon name="resistor"></Icon>
        </div>
      </drag>
      <drag class="drag" :transfer-data="{ name: 'switchOpen', origin: 'origin', data: '' }" :image-x-offset="117.5" :image-y-offset="90">
        <Icon name="switchOpen"></Icon>
        <h4>Open Switch</h4>
        <div slot="image" class="drag-image">
          <Icon name="switchOpen"></Icon>
        </div>
      </drag>
      <drag class="drag" :transfer-data="{ name: 'switchClosed', origin: 'origin', data: '' }" :image-x-offset="117.5" :image-y-offset="90">
        <Icon name="switchClosed"></Icon>
        <h4>Closed Switch</h4>
        <div slot="image" class="drag-image">
          <Icon name="switchClosed"></Icon>
        </div>
      </drag>
      <drag class="drag" :transfer-data="{ name: 'voltmeter', origin: 'origin', data: '' }" :image-x-offset="117.5" :image-y-offset="90">
        <Icon name="voltmeter"></Icon>
        <h4>Voltmeter</h4>
        <div slot="image" class="drag-image">
          <Icon name="voltmeter"></Icon>
        </div>
      </drag>
      <drag class="drag" :transfer-data="{ name: 'ammeter', origin: 'origin', data: '' }" :image-x-offset="117.5" :image-y-offset="90">
        <Icon name="ammeter"></Icon>
        <h4>Ammeter</h4>
        <div slot="image" class="drag-image">
          <Icon name="ammeter"></Icon>
        </div>
      </drag>
      <drop id="trash" @drop="handleTrash">
      <Icon name="garbage"></Icon>
      </drop>
    </div>
    <div id="display" ref="container" class="area">
    <drop id="drop" class="drop" @drop="handleDrop">
      <div class="component" :class="{selected: selected === component.id}" @click="select(component.id)" :style=" {left: component.x - 37.5 + 'px', top: component.y - 37.5 + 'px'}" :key="component.id" v-for="component in components">
        <!-- <Icon :name="component.name"></Icon> -->
        <drag class="drag" :transfer-data="{ name: component.name, origin: 'display', id: component.id }" :image-x-offset="84.5" :image-y-offset="92.5">
          <Icon :name="component.name"></Icon>
          <div slot="image" class="drag-image">
            <Icon :name="component.name"></Icon>
          </div>
        </drag>
      </div>
      <div class="connector" :style="{left: connector.x + 'px', top: connector.y + 'px', width: connector.width + 'px', height: connector.height + 'px'}" :key="connector.id" v-for="connector in connectors">
        <path id="curve" d="M0 0" stroke="green" stroke-width="4" stroke-linecap="round" fill="transparent"></path>
        <!-- <div class="sideline start"></div>
        <div class="centerline">
          <div class="centerlinetop"></div>
          <div class="centerlinebottom"></div>
        </div>
        <div class="sideline end"></div> -->
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
import Icon from '@/components/Icon.vue'
let uuid = 0

export default {
  name: 'display-area',
  data: function () {
    return {
      components: [],
      connectors: [],
      currentOutput: 'Your latest action will be described here.',
      selected: ''
    }
  },
  methods: {
    handleDrop (data, event) {
      let x = Math.round((event.pageX - this.$refs.container.getBoundingClientRect().left) / 10) * 10
      let y = Math.round((event.pageY - this.$refs.container.getBoundingClientRect().top) / 10) * 10
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
        if (component.id !== data.id && Math.abs(x - component.x) < 100 && Math.abs(y - component.y) < 60) overlap = true
      }

      // add component
      if (overlap) {
        this.currentOutput = 'Unable to ' + verb + ' the ' + data.name + ' as it overlapped with another component.'
      } else {
        let id = uuid
        if (data.origin === 'display') {
          let i = this.components.map(component => component.id).indexOf(data.id) // find index of your object
          this.components.splice(i, 1) // remove it from array
          id = data.id
        } else {
          uuid++
        }

        this.components.push({
          id: id,
          name: data.name,
          x: x,
          y: y
        })
        if (data.origin === 'display') {
          // update connectors
          this.updateConnectors()
        }

        this.currentOutput = 'The ' + data.name + ' was ' + verb + 'd successfully.'
      }
    },
    handleTrash (data, event) {
      if (data.origin === 'origin') {
        this.currentOutput = 'Unable to delete the ' + data.name + ' as it was never placed.'
      } else {
        let i = this.components.map(component => component.id).indexOf(data.id) // find index of your object
        this.components.splice(i, 1) // remove it from array
        this.currentOutput = 'The ' + data.name + ' was deleted successfully.'
      }
    },
    select (id) {
      if (this.selected === '') { this.selected = id } else if (this.selected === id) {
        this.currentOutput = 'Cannot connect ' + this.components.find(component => component.id === this.selected).name + ' with itself.'
        this.selected = ''
      } else if (this.connectors.filter(elem => (elem.start === this.selected && elem.end === id) || (elem.start === id && elem.end === this.selected)).length > 1) {
        this.currentOutput = 'The ' + this.components.find(component => component.id === this.selected).name + ' and ' + this.components.find(component => component.id === id).name + ' are already connected in a loop.'
        this.selected = ''
      } else {
          this.connectors.push({
            start: this.selected,
            end: id,
            x: '',
            y: '',
            width: '',
            height: ''
          })
          this.currentOutput = 'A connection between ' + this.components.find(component => component.id === this.selected).name + ' and ' + this.components.find(component => component.id === id).name + ' was created successfully.'
          this.selected = ''

          // update connectors
          this.updateConnectors()
      }
    },
    updateConnectors() {
      for (let i = 0; i < this.connectors.length; i++) {
        let connector = this.connectors[i]
        let startObj = this.components.find(component => component.id === connector.start)
        let endObj = this.components.find(component => component.id === connector.end)
        
        
      }
    }
    /*
    updateConnectors () {
      for (let i = 0; i < this.connectors.length; i++) {
        let connector = this.connectors[i]
        let startObj = this.components.find(component => component.id === connector.start)
        let endObj = this.components.find(component => component.id === connector.end)

        // console.log(Math.abs(startObj.x - endObj.x) > 100)
        // this.connectors.filter(elem => (elem.start === this.selected && elem.end === id) || (elem.start === id && elem.end === this.selected)).length

        // beside
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
    }*/
  },
  components: {
    Icon,
    Drag,
    Drop
  }
}
</script>

<style lang="scss" scoped>
.component {
  position: absolute;

  &.selected {
    background-color: var(--darkergrey);
    border-radius: 13px;
  }
}

.connector {
  background-color: red;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  .sideline {
    border-top: 5px solid #ada;
    width: 50%;
    position: relative;
    height: 0px;

    &.start::before {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: #ada;
      left: -5px;
      top: calc(50% - 8px);
      border-radius: 7px;
    }

    &.end::before {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: #ada;
      right: -5px;
      top: calc(50% - 8px);
      border-radius: 7px;
    }
  }
}

.drag,
.drop {
  display: inline-block;
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
  padding-bottom: 4px;
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
