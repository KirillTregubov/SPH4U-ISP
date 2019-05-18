<template>
  <div id="main-area">
    <div id="origin" class="area">
      <drag class="drag" transfer-data="ammeter" :image-x-offset="50" :image-y-offset="37.5">
        <Icon><Ammeter /></Icon>
        <div slot="image" class="drag-image">
          <Icon><Ammeter /></Icon>
			  </div>
      </drag>
      <Icon><Battery /></Icon>
      <Icon><SwitchClosed /></Icon>
      <Icon><SwitchOpen /></Icon>
      <Icon><Voltmeter /></Icon>
      <Icon><Light /></Icon>
      <Icon><Resistor /></Icon>
      <Icon><Buzzer /></Icon>
    </div>
    <!-- <div id="display" class="area"> -->
      <drop id="display" ref="container" class="area drop" @drop="handleDrop"></drop>
    <!-- </div> -->
  </div>
</template>

<script>
import { Drag, Drop } from 'vue-drag-drop';
import Vue from 'vue'
import Icon from "@/components/Icon.vue";
import Ammeter from "@/components/icons/Ammeter.vue";
import Battery from "@/components/icons/Battery.vue";
import SwitchClosed from "@/components/icons/SwitchClosed.vue";
import SwitchOpen from "@/components/icons/SwitchOpen.vue";
import Voltmeter from "@/components/icons/Voltmeter.vue";
import Light from "@/components/icons/Light.vue";
import Resistor from "@/components/icons/Resistor.vue";
import Buzzer from "@/components/icons/Buzzer.vue";

export default {
  name: "display-area",
  data: function() {
    return {
      components: []
    };
  },
  beforeMount: function() {},
  methods: {
    getPos(element) {
         const left = this.$refs.element.getBoundingClientRect().left
         const top = this.$refs.element.getBoundingClientRect().top
    },
    handleDrop(data, event) {
      // alert(`You dropped with data: ${JSON.stringify(data)}`);
      var x = event.pageX;
      var y = event.pageY;
      console.log(x + " " + y)
      if (data === "ammeter") {
        var ComponentClass = Vue.extend(Icon)
        var instance = new ComponentClass({
            propsData: { type: 'primary' }
        })
        instance.$slots.default = ['Click me!']
        instance.$mount()
        this.$refs.container.appendChild(instance.$el)
      }
    }
  },
  components: {
    Icon,
    Ammeter,
    Battery,
    SwitchClosed,
    SwitchOpen,
    Voltmeter,
    Light,
    Resistor,
    Buzzer,
    Drag,
    Drop
  }
};
</script>

<style lang="scss">
.drag, .drop {
  display: inline-block;
}
.area {
  @include container(var(--black));
  margin: 0 auto;
}

#display {
  width: 1000px;
  height: 600px;
  background-color: var(--black);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E");
}

#origin {
  margin-bottom: 15px;

  svg {
    margin: 0 15px;
  }
}

@media only screen and (max-width: 1019px) {
  #display {
    display: none;
  }
}
</style>
