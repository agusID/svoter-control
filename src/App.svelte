<script>
  import { Router, Link, Route } from 'svelte-routing'
  import Home from '@views/Home'

  export let url = ''
</script>

<Router {url}>
  <div>
    <Route path="/" component={Home} />
  </div>
</Router>
