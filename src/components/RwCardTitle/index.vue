<template>
  <div :class="'rw-card-title '+selfbg">
    <span
      v-if="!notitle"
      class="cardtitle-line" >
      <i/>
    </span>
    <span
      v-if="!notitle"
      class="card-title" >{{ title }}</span>
    <slot/>
    <span class="right">
      <slot name="right"/>
    </span>
  </div>
</template>

<script>
export default {
    name: 'CardTitle',
    props: {
        title: {
            type: String,
            default: ''
        },
        selfbg: {
            type: String,
            default: ''
        },
        notitle: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {

    }

}
</script>
