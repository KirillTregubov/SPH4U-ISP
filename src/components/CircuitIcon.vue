<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 298 298"
    enable-background="new 0 0 298 298"
    class="circuitIcon"
    :width="size"
    :height="size"
    :style="style"
  >
    <Ammeter v-if="name === 'ammeter'"></Ammeter>
    <Battery v-else-if="name === 'battery'"></Battery>
    <SwitchClosed v-else-if="name === 'switchClosed'"></SwitchClosed>
    <SwitchOpen v-else-if="name === 'switchOpen'"></SwitchOpen>
    <Voltmeter v-else-if="name === 'voltmeter'"></Voltmeter>
    <Light v-else-if="name === 'light'"></Light>
    <Resistor v-else-if="name === 'resistor'"></Resistor>
    <Buzzer v-else-if="name === 'buzzer'"></Buzzer>
    <Garbage v-else-if="name === 'garbage'"></Garbage>
    <Default v-else></Default>
  </svg>
</template>

<script>
import Ammeter from '@/components/icons/Ammeter.vue'
import Battery from '@/components/icons/Battery.vue'
import SwitchClosed from '@/components/icons/SwitchClosed.vue'
import SwitchOpen from '@/components/icons/SwitchOpen.vue'
import Voltmeter from '@/components/icons/Voltmeter.vue'
import Light from '@/components/icons/Light.vue'
import Resistor from '@/components/icons/Resistor.vue'
import Buzzer from '@/components/icons/Buzzer.vue'
import Garbage from '@/components/icons/Garbage.vue'
import Default from '@/components/icons/Default.vue'

export default {
  props: {
    size: {
      type: [Number, String],
      default: 75
    },
    color: {
      type: String,
      default: 'white'
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    style: function () {
      return {
        fill: 'var(--' + this.color + ')'
      }
    }
  },
  components: {
    Ammeter,
    Battery,
    SwitchClosed,
    SwitchOpen,
    Voltmeter,
    Light,
    Resistor,
    Buzzer,
    Garbage,
    Default
  }
}
</script>
