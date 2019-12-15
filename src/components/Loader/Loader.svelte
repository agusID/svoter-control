<script>
  import { mixcls } from '@helpers'

  export let color = 'primary'
  export let type = 'default'

  $: classes = mixcls([
    'loader',
    `${type}-loader`,
  ])

  $: classsPath = mixcls([
    'path',
    `${color}-color`
  ])
</script>

<style>

.loader {
  position: relative;
  margin: 0 auto;
}

.loader:before {
  content: '';
  display: block;
  padding-top: 100%;
}

.loader.default-loader {
  width: 40px;
}

.loader.button-loader {
  width: 20px;
}
  

.circular {
  animation: rotate 2s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}


.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
  stroke-linecap: round;
}

.path.primary-color {
  stroke: white;
}
    
@keyframes rotate {
  100% {
    transform: rotate(360deg)
  }
}


@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}


</style>

<div class={classes}>
  <svg class="circular" viewBox="25 25 50 50">
    <circle class={classsPath} cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
  </svg>
</div>
